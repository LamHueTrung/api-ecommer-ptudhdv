import javax.swing.*;
import javax.swing.filechooser.FileNameExtensionFilter;
import javax.swing.text.*;
import java.awt.*;
import java.io.*;
import java.net.*;

public class ChatClient {
    private static final String SERVER_ADDRESS = "localhost";
    private static final int SERVER_PORT = 12345;

    private Socket socket;
    private BufferedReader in;
    private PrintWriter out;

    private JFrame frame;
    private JTextPane chatArea;
    private JTextField inputField;
    private JButton sendButton;
    private JButton emojiButton;
    private JButton imageButton;
    private DefaultListModel<String> userListModel;
    private JList<String> userList;

    private String currentChatTarget = "Global";
    private String username;

    public ChatClient() {
        setupUI();
        connectToServer();
    }

    private void setupUI() {
        frame = new JFrame("Chat Client");
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setSize(800, 600);

        chatArea = new JTextPane();
        chatArea.setEditable(false);
        frame.add(new JScrollPane(chatArea), BorderLayout.CENTER);

        inputField = new JTextField();
        sendButton = new JButton("Send");
        emojiButton = new JButton("Emoji");
        imageButton = new JButton("Image");

        JPanel inputPanel = new JPanel(new BorderLayout());
        JPanel buttonPanel = new JPanel();
        buttonPanel.add(emojiButton);
        buttonPanel.add(imageButton);

        inputPanel.add(inputField, BorderLayout.CENTER);
        inputPanel.add(sendButton, BorderLayout.EAST);
        inputPanel.add(buttonPanel, BorderLayout.SOUTH);

        frame.add(inputPanel, BorderLayout.SOUTH);

        userListModel = new DefaultListModel<>();
        userList = new JList<>(userListModel);
        userListModel.addElement("Global");
        userList.setSelectionMode(ListSelectionModel.SINGLE_SELECTION);

        userList.addListSelectionListener(e -> {
            if (!e.getValueIsAdjusting()) {
                String selectedUser = userList.getSelectedValue();
                if (selectedUser != null) {
                    currentChatTarget = selectedUser;
                    appendTextToChatArea("Now chatting with: " + selectedUser, Color.BLUE, false);
                }
            }
        });

        JPanel rightPanel = new JPanel(new BorderLayout());
        rightPanel.add(new JLabel("Online Users"), BorderLayout.NORTH);
        rightPanel.add(new JScrollPane(userList), BorderLayout.CENTER);
        frame.add(rightPanel, BorderLayout.EAST);

        sendButton.addActionListener(e -> sendMessage());
        emojiButton.addActionListener(e -> selectEmoji());
        imageButton.addActionListener(e -> sendImage());
        inputField.addActionListener(e -> sendMessage());

        frame.setVisible(true);
    }

    private void connectToServer() {
        try {
            socket = new Socket(SERVER_ADDRESS, SERVER_PORT);
            socket.setSoTimeout(120000);
            in = new BufferedReader(new InputStreamReader(socket.getInputStream()));
            out = new PrintWriter(socket.getOutputStream(), true);

            new Thread(this::listenForMessages).start();

            username = JOptionPane.showInputDialog(frame, "Enter your username:", "Login",
                    JOptionPane.PLAIN_MESSAGE);
            if (username != null && !username.trim().isEmpty()) {
                out.println(username);
                frame.setTitle("Chat Client - " + username);
            } else {
                JOptionPane.showMessageDialog(frame, "Username cannot be empty.", "Error", JOptionPane.ERROR_MESSAGE);
                System.exit(0);
            }
        } catch (IOException e) {
            JOptionPane.showMessageDialog(frame, "Unable to connect to server.", "Error", JOptionPane.ERROR_MESSAGE);
            System.exit(0);
        }
    }

    private void sendMessage() {
        String message = inputField.getText().trim();
        if (!message.isEmpty()) {
            String timestamp = getCurrentTimestamp();
            if (currentChatTarget.equals("Global")) {
                out.println(message);
                appendTextToChatArea(timestamp + " [Me]: " + message, Color.GREEN, true);
            } else {
                out.println("/private " + currentChatTarget + " " + message);
                appendTextToChatArea(timestamp + " [Private to " + currentChatTarget + "]: " + message, Color.GREEN,
                        true);
            }
            inputField.setText("");
        }
    }

    private String getCurrentTimestamp() {
        return "[" + new java.text.SimpleDateFormat("HH:mm:ss").format(new java.util.Date()) + "]";
    }

    private void selectEmoji() {
        String[] emojis = { "😊", "😂", "👍", "❤️", "🎉" };
        String emoji = (String) JOptionPane.showInputDialog(frame, "Select an emoji", "Emoji",
                JOptionPane.PLAIN_MESSAGE, null, emojis, emojis[0]);
        if (emoji != null) {
            inputField.setText(inputField.getText() + emoji);
        }
    }

    private void sendImage() {
        JFileChooser fileChooser = new JFileChooser();
        fileChooser.setFileFilter(new FileNameExtensionFilter("Image files", "jpg", "png", "gif"));
        int returnValue = fileChooser.showOpenDialog(frame);
        if (returnValue == JFileChooser.APPROVE_OPTION) {
            File file = fileChooser.getSelectedFile();
            try {
                sendImageToServer(file);
            } catch (IOException e) {
                appendTextToChatArea("Failed to send image.", Color.RED, false);
            }
        }
    }

    private void sendImageToServer(File file) throws IOException {
        try {
            long fileSize = file.length();

            if (fileSize > 10 * 1024 * 1024) {
                appendTextToChatArea("🚫 Image too large! Limit: 10MB", Color.RED, false);
                return;
            }

            out.println("/image " + file.getName() + " " + fileSize);
            out.flush();

            FileInputStream fis = new FileInputStream(file);
            BufferedOutputStream bos = new BufferedOutputStream(socket.getOutputStream());

            byte[] buffer = new byte[4096];
            int bytesRead;
            while ((bytesRead = fis.read(buffer)) != -1) {
                bos.write(buffer, 0, bytesRead);
            }
            bos.flush();

            fis.close();

            String serverResponse = in.readLine();
            if (serverResponse != null) {
                appendTextToChatArea("✅ Server: " + serverResponse, Color.GREEN, false);
            }
        } catch (IOException e) {
            appendTextToChatArea("❌ Error sending image: " + e.getMessage(), Color.RED, false);
            e.printStackTrace();
        }
    }

    private void listenForMessages() {
        try {
            String message;
            while ((message = in.readLine()) != null) {
                if (message.startsWith("/users ")) {
                    updateUserList(message.substring(7));
                } else if (message.startsWith("[") && message.contains("]")) {
                    appendTextToChatArea(message, Color.BLACK, false);
                }
            }
        } catch (IOException e) {
            JOptionPane.showMessageDialog(frame, "Disconnected from server.", "Error", JOptionPane.ERROR_MESSAGE);
            System.exit(0);
        }
    }

    private void updateUserList(String userListString) {
        SwingUtilities.invokeLater(() -> {
            userListModel.clear();
            userListModel.addElement("Global");
            String[] users = userListString.split(",");
            for (String user : users) {
                if (!user.isEmpty() && !user.equals(username)) {
                    userListModel.addElement(user.trim());
                }
            }
        });
    }

    private void appendTextToChatArea(String message, Color color, boolean alignRight) {
        SwingUtilities.invokeLater(() -> {
            try {
                StyledDocument doc = chatArea.getStyledDocument();
                SimpleAttributeSet attributes = new SimpleAttributeSet();
                StyleConstants.setForeground(attributes, color);
                StyleConstants.setAlignment(attributes,
                        alignRight ? StyleConstants.ALIGN_RIGHT : StyleConstants.ALIGN_LEFT);
                doc.setParagraphAttributes(doc.getLength(), 1, attributes, false);
                doc.insertString(doc.getLength(), message + "\n", attributes);
            } catch (BadLocationException e) {
                e.printStackTrace();
            }
        });
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(ChatClient::new);
    }
}
