import java.io.*;
import java.net.*;
import java.text.SimpleDateFormat;
import java.util.*;

public class ChatServer {
    private static final int PORT = 12345;
    private static final String IMAGE_SAVE_PATH = "chat_images/";
    private static final String CHAT_HISTORY_FILE = "chat_history.txt";
    private static Set<ClientHandler> clientHandlers = Collections.synchronizedSet(new HashSet<>());

    public static void main(String[] args) {
        File imageDir = new File(IMAGE_SAVE_PATH);
        if (!imageDir.exists()) {
            imageDir.mkdir();
        }

        try (ServerSocket serverSocket = new ServerSocket(PORT)) {
            System.out.println("Server is running on port " + PORT);

            while (true) {
                Socket clientSocket = serverSocket.accept();
                clientSocket.setSoTimeout(120000);
                ClientHandler clientHandler = new ClientHandler(clientSocket);
                clientHandlers.add(clientHandler);
                new Thread(clientHandler).start();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static void broadcastMessage(String message, ClientHandler excludeClient) {
        synchronized (clientHandlers) {
            for (ClientHandler client : clientHandlers) {
                if (client != excludeClient) {
                    client.sendMessage(message);
                }
            }
        }
        saveMessageToHistory(message);
    }

    public static void saveMessageToHistory(String message) {
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(CHAT_HISTORY_FILE, true))) {
            writer.write(message);
            writer.newLine();
        } catch (IOException e) {
            System.err.println("Error saving message to history: " + e.getMessage());
        }
    }

    public static void updateUsersList() {
        synchronized (clientHandlers) {
            StringBuilder userList = new StringBuilder();
            for (ClientHandler client : clientHandlers) {
                userList.append(client.getUsername()).append(",");
            }

            String userListMessage = "/users " + userList.toString();
            for (ClientHandler client : clientHandlers) {
                client.sendMessage(userListMessage);
            }
        }
    }

    public static void removeClient(ClientHandler clientHandler) {
        clientHandlers.remove(clientHandler);
        updateUsersList();
    }

    static class ClientHandler implements Runnable {
        private Socket socket;
        private PrintWriter out;
        private BufferedReader in;
        private String username;

        public ClientHandler(Socket socket) {
            this.socket = socket;
        }

        @Override
        public void run() {
            try {
                in = new BufferedReader(new InputStreamReader(socket.getInputStream()));
                out = new PrintWriter(socket.getOutputStream(), true);

                out.println("Enter your username:");
                username = in.readLine();
                if (username == null || username.trim().isEmpty()) {
                    closeConnections();
                    return;
                }

                System.out.println(username + " has joined.");
                broadcastMessage(getTimestamp() + " [Global] " + username + " has joined the chat!", this);
                updateUsersList();

                String message;
                while ((message = in.readLine()) != null) {
                    if (socket.isClosed())
                        break;
                    if (message.startsWith("/private")) {
                        handlePrivateMessage(message);
                    } else if (message.startsWith("/image")) {
                        handleImageMessage(message);
                    } else {
                        String formattedMessage = getTimestamp() + " [Global] " + username + ": " + message;
                        broadcastMessage(formattedMessage, this);
                        sendMessage(formattedMessage);
                    }
                }
            } catch (IOException e) {
                System.err.println("IOException while handling client '" + username + "': " + e.getMessage());
            } finally {
                System.out.println(username + " has left.");
                if (socket != null && !socket.isClosed()) {
                    broadcastMessage(getTimestamp() + " [Global] " + username + " has left the chat.", this);
                    ChatServer.removeClient(this);
                }
                closeConnections();
            }
        }

        private void handlePrivateMessage(String message) {
            String[] parts = message.split(" ", 3);
            if (parts.length >= 3) {
                String targetUser = parts[1];
                String privateMessage = parts[2];
                boolean found = false;

                synchronized (clientHandlers) {
                    for (ClientHandler client : clientHandlers) {
                        if (client.getUsername().equals(targetUser)) {
                            String formattedMessage = getTimestamp() + " [Private] " + username + " -> " + targetUser
                                    + ": " + privateMessage;
                            client.sendMessage(formattedMessage);
                            sendMessage(formattedMessage);
                            saveMessageToHistory(formattedMessage);
                            found = true;
                            break;
                        }
                    }
                }

                if (!found) {
                    sendMessage("User " + targetUser + " not found.");
                }
            } else {
                sendMessage("Invalid private message format. Use /private <username> <message>");
            }
        }

        private void handleImageMessage(String message) {
            try {
                String[] parts = message.split(" ", 3);
                if (parts.length < 3) {
                    sendMessage("Invalid image message format.");
                    return;
                }

                String fileName = parts[1];
                long fileSize = Long.parseLong(parts[2]);
                File imageFile = new File(IMAGE_SAVE_PATH + fileName);

                try (FileOutputStream fos = new FileOutputStream(imageFile);
                        InputStream inputStream = socket.getInputStream()) {
                    byte[] buffer = new byte[4096];
                    long totalBytesRead = 0;
                    while (totalBytesRead < fileSize) {
                        int bytesRead = inputStream.read(buffer);
                        if (bytesRead == -1)
                            break;
                        fos.write(buffer, 0, bytesRead);
                        totalBytesRead += bytesRead;
                    }

                    if (totalBytesRead != fileSize) {
                        sendMessage("Image transfer failed. File size mismatch.");
                        return;
                    }
                }

                String imageMessage = getTimestamp() + " /image " + imageFile.getAbsolutePath();
                broadcastMessage(imageMessage, this);
                updateUsersList();
            } catch (IOException e) {
                System.err.println("Error while receiving image: " + e.getMessage());
                sendMessage("Error while receiving image: " + e.getMessage());
                closeConnections();
            }
        }

        private String getTimestamp() {
            SimpleDateFormat sdf = new SimpleDateFormat("HH:mm:ss");
            return "[" + sdf.format(new Date()) + "]";
        }

        public String getUsername() {
            return username;
        }

        public void sendMessage(String message) {
            out.println(message);
        }

        private void closeConnections() {
            try {
                if (socket != null && !socket.isClosed()) {
                    socket.close();
                    System.out.println("Socket closed successfully.");
                }
            } catch (IOException e) {
                System.err.println("Error closing socket: " + e.getMessage());
            }
        }
    }
}
