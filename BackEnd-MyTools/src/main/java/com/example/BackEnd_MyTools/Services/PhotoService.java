package com.example.BackEnd_MyTools.Services;

import com.mongodb.client.gridfs.model.GridFSFile;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.gridfs.GridFsResource;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.Color;
import java.awt.Font;
import java.awt.FontMetrics;
import java.awt.Graphics2D;
import java.awt.RenderingHints;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.Optional;

@Service
public class PhotoService {
    @Autowired private GridFsTemplate gridFsTemplate;

    public String saveFromUrl(String imageUrl) throws IOException {
        URL url = new URL(imageUrl);
        try (InputStream inputStream = url.openStream()) {
            ObjectId id = gridFsTemplate.store(inputStream, imageUrl.substring(imageUrl.lastIndexOf('/') + 1), MediaType.IMAGE_PNG_VALUE);
            return id.toString();
        }
    }

    public String savePhoto(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) throw new IllegalArgumentException("Photo file is required");
        ObjectId id = gridFsTemplate.store(file.getInputStream(), sanitizeFilename(file.getOriginalFilename(), "uploaded-photo.png"), file.getContentType() != null ? file.getContentType() : MediaType.APPLICATION_OCTET_STREAM_VALUE);
        return id.toString();
    }

    public String saveGeneratedImage(String title, String context) throws IOException {
        byte[] png = generateDemoImage(title, context);
        try (InputStream inputStream = new ByteArrayInputStream(png)) {
            ObjectId id = gridFsTemplate.store(inputStream, slugify(title) + ".png", MediaType.IMAGE_PNG_VALUE);
            return id.toString();
        }
    }

    public Optional<PhotoData> getPhoto(String id) throws IOException {
        if (id == null || !ObjectId.isValid(id)) return Optional.empty();
        GridFSFile file = gridFsTemplate.findOne(new Query(Criteria.where("_id").is(new ObjectId(id))));
        if (file == null) return Optional.empty();
        GridFsResource resource = gridFsTemplate.getResource(file);
        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            resource.getInputStream().transferTo(outputStream);
            return Optional.of(new PhotoData(outputStream.toByteArray(), resource.getContentType() != null ? resource.getContentType() : MediaType.IMAGE_JPEG_VALUE));
        }
    }

    public record PhotoData(byte[] bytes, String contentType) {}

    private byte[] generateDemoImage(String title, String context) throws IOException {
        int width = 960, height = 640;
        BufferedImage image = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
        Graphics2D g = image.createGraphics();
        try {
            g.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
            int seed = Math.abs((safeText(title) + "|" + safeText(context)).hashCode());
            Color start = new Color(40 + seed % 90, 70 + (seed / 7) % 90, 110 + (seed / 13) % 90);
            Color end = new Color(15 + (seed / 17) % 80, 30 + (seed / 23) % 80, 60 + (seed / 31) % 80);
            for (int y=0; y<height; y++) {
                float ratio = y / (float) height;
                g.setColor(new Color((int)(start.getRed()*(1-ratio)+end.getRed()*ratio), (int)(start.getGreen()*(1-ratio)+end.getGreen()*ratio), (int)(start.getBlue()*(1-ratio)+end.getBlue()*ratio)));
                g.drawLine(0,y,width,y);
            }
            g.setColor(new Color(255,255,255,35));
            for (int i=0;i<9;i++) { int size=120+(seed+i*37)%220; int x=-60+(seed/(i+1)+i*137)%width; int y=-60+(seed/(i+3)+i*97)%height; g.fillOval(x,y,size,size); }
            g.setColor(new Color(255,255,255,235)); g.setFont(new Font(Font.SANS_SERIF, Font.BOLD, 48)); drawCenteredWrapped(g, safeText(title), width, 230, 760, 58);
            g.setColor(new Color(255,255,255,205)); g.setFont(new Font(Font.SANS_SERIF, Font.PLAIN, 28)); drawCenteredWrapped(g, safeText(context), width, 405, 760, 36);
            g.setColor(new Color(255,255,255,175)); g.setFont(new Font(Font.MONOSPACED, Font.BOLD, 22)); drawCentered(g, "MY-TOOLS DEMO ASSET", width, 570);
        } finally { g.dispose(); }
        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) { ImageIO.write(image, "png", outputStream); return outputStream.toByteArray(); }
    }
    private void drawCenteredWrapped(Graphics2D g, String text, int imageWidth, int startY, int maxWidth, int lineHeight) {
        String[] words = text.split("\\s+"); StringBuilder line = new StringBuilder(); int y = startY;
        for (String word : words) { String candidate = line.length()==0 ? word : line + " " + word; if (g.getFontMetrics().stringWidth(candidate)>maxWidth && line.length()>0) { drawCentered(g, line.toString(), imageWidth, y); line = new StringBuilder(word); y += lineHeight; } else line = new StringBuilder(candidate); }
        if (line.length()>0) drawCentered(g, line.toString(), imageWidth, y);
    }
    private void drawCentered(Graphics2D g, String text, int imageWidth, int y) { FontMetrics m = g.getFontMetrics(); int x = (imageWidth - m.stringWidth(text))/2; g.drawString(text, Math.max(30,x), y); }
    private String sanitizeFilename(String name, String fallback) { return (name==null || name.isBlank()) ? fallback : name.replaceAll("[^a-zA-Z0-9._-]", "_"); }
    private String slugify(String value) { String n = new String(safeText(value).getBytes(StandardCharsets.UTF_8), StandardCharsets.UTF_8).toLowerCase().replaceAll("[^a-z0-9]+", "-").replaceAll("(^-|-$)", ""); return n.isBlank()?"mytools-demo-image":n; }
    private String safeText(String value) { return value == null || value.isBlank() ? "My-Tools" : value; }
}
