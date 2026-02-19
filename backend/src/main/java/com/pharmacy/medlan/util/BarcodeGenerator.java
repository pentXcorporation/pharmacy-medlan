package com.pharmacy.medlan.util;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import javax.imageio.ImageIO;

@Component
@Slf4j
public class BarcodeGenerator {

    private static final int DEFAULT_WIDTH = 300;
    private static final int DEFAULT_HEIGHT = 100;
    private static final int QR_SIZE = 250;

    /**
     * Generate a barcode image as byte array (CODE_128 format)
     */
    public byte[] generateBarcode(String content) {
        return generateBarcode(content, DEFAULT_WIDTH, DEFAULT_HEIGHT);
    }

    /**
     * Generate a barcode image as byte array with custom dimensions
     */
    public byte[] generateBarcode(String content, int width, int height) {
        try {
            Map<EncodeHintType, Object> hints = new HashMap<>();
            hints.put(EncodeHintType.CHARACTER_SET, "UTF-8");

            BitMatrix bitMatrix = new MultiFormatWriter().encode(
                    content, BarcodeFormat.CODE_128, width, height, hints);

            BufferedImage image = MatrixToImageWriter.toBufferedImage(bitMatrix);
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            ImageIO.write(image, "PNG", outputStream);
            return outputStream.toByteArray();
        } catch (WriterException | IOException e) {
            log.error("Error generating barcode for content: {}", content, e);
            throw new RuntimeException("Failed to generate barcode", e);
        }
    }

    /**
     * Generate a QR code image as byte array
     */
    public byte[] generateQRCode(String content) {
        return generateQRCode(content, QR_SIZE, QR_SIZE);
    }

    /**
     * Generate a QR code image as byte array with custom dimensions
     */
    public byte[] generateQRCode(String content, int width, int height) {
        try {
            Map<EncodeHintType, Object> hints = new HashMap<>();
            hints.put(EncodeHintType.CHARACTER_SET, "UTF-8");
            hints.put(EncodeHintType.MARGIN, 1);

            BitMatrix bitMatrix = new MultiFormatWriter().encode(
                    content, BarcodeFormat.QR_CODE, width, height, hints);

            BufferedImage image = MatrixToImageWriter.toBufferedImage(bitMatrix);
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            ImageIO.write(image, "PNG", outputStream);
            return outputStream.toByteArray();
        } catch (WriterException | IOException e) {
            log.error("Error generating QR code for content: {}", content, e);
            throw new RuntimeException("Failed to generate QR code", e);
        }
    }

    /**
     * Generate a barcode as a BufferedImage
     */
    public BufferedImage generateBarcodeImage(String content) {
        try {
            Map<EncodeHintType, Object> hints = new HashMap<>();
            hints.put(EncodeHintType.CHARACTER_SET, "UTF-8");

            BitMatrix bitMatrix = new MultiFormatWriter().encode(
                    content, BarcodeFormat.CODE_128, DEFAULT_WIDTH, DEFAULT_HEIGHT, hints);

            return MatrixToImageWriter.toBufferedImage(bitMatrix);
        } catch (WriterException e) {
            log.error("Error generating barcode image for content: {}", content, e);
            throw new RuntimeException("Failed to generate barcode image", e);
        }
    }
}
