package com.pharmacy.medlan.util;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.Set;
import java.util.UUID;

@Component
@Slf4j
public class FileUploadUtil {

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    private static final Set<String> ALLOWED_EXTENSIONS = Set.of(
            "jpg", "jpeg", "png", "gif", "pdf", "doc", "docx", "xls", "xlsx", "csv"
    );

    /**
     * Save an uploaded file and return the stored file path
     */
    public String saveFile(MultipartFile file, String subDirectory) {
        validateFile(file);

        try {
            String fileName = generateUniqueFileName(file.getOriginalFilename());
            Path directory = Paths.get(uploadDir, subDirectory);
            Files.createDirectories(directory);

            Path filePath = directory.resolve(fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            log.info("File saved: {}", filePath);
            return subDirectory + "/" + fileName;
        } catch (IOException e) {
            log.error("Error saving file: {}", file.getOriginalFilename(), e);
            throw new RuntimeException("Failed to save file", e);
        }
    }

    /**
     * Delete a file by its relative path
     */
    public boolean deleteFile(String filePath) {
        try {
            Path path = Paths.get(uploadDir, filePath);
            boolean deleted = Files.deleteIfExists(path);
            if (deleted) {
                log.info("File deleted: {}", path);
            }
            return deleted;
        } catch (IOException e) {
            log.error("Error deleting file: {}", filePath, e);
            return false;
        }
    }

    /**
     * Check if a file exists
     */
    public boolean fileExists(String filePath) {
        return Files.exists(Paths.get(uploadDir, filePath));
    }

    /**
     * Get the full path of a file
     */
    public Path getFilePath(String relativePath) {
        return Paths.get(uploadDir, relativePath);
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File is empty or null");
        }
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("File size exceeds maximum allowed size of 10MB");
        }
        String extension = getFileExtension(file.getOriginalFilename());
        if (!ALLOWED_EXTENSIONS.contains(extension.toLowerCase())) {
            throw new IllegalArgumentException("File type '" + extension + "' is not allowed");
        }
    }

    private String generateUniqueFileName(String originalFileName) {
        String extension = getFileExtension(originalFileName);
        return UUID.randomUUID() + "." + extension;
    }

    private String getFileExtension(String fileName) {
        if (fileName == null || !fileName.contains(".")) {
            return "";
        }
        return fileName.substring(fileName.lastIndexOf(".") + 1);
    }
}
