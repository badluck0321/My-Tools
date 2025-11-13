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

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Optional;

@Service
public class PhotoService {

    @Autowired
    private GridFsTemplate gridFsTemplate;

    public String savePhoto(MultipartFile file) throws IOException {
        ObjectId id = gridFsTemplate.store(
                file.getInputStream(),
                file.getOriginalFilename(),
                file.getContentType());
        return id.toString();
    }

    public Optional<PhotoData> getPhoto(String id) throws IOException {
        GridFSFile file = gridFsTemplate.findOne(new Query(Criteria.where("_id").is(new ObjectId(id))));
        if (file == null)
            return Optional.empty();

        GridFsResource resource = gridFsTemplate.getResource(file);
        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            resource.getInputStream().transferTo(outputStream);
            return Optional.of(new PhotoData(
                    outputStream.toByteArray(),
                    resource.getContentType() != null ? resource.getContentType() : MediaType.IMAGE_JPEG_VALUE));
        }
    }

    public record PhotoData(byte[] bytes, String contentType) {
    }
}

// package com.example.BackEnd_MyTools.Services;

// import java.io.FileNotFoundException;
// import java.io.IOException;
// import org.springframework.stereotype.Service;
// import org.springframework.web.multipart.MultipartFile;
// import org.springframework.data.mongodb.gridfs.GridFsTemplate;
// import com.mongodb.client.gridfs.model.GridFSFile;
// import org.springframework.data.mongodb.gridfs.GridFsResource;
// import org.bson.types.ObjectId;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.data.mongodb.core.query.Criteria;
// import org.springframework.data.mongodb.core.query.Query;

// @Service
// public class PhotoService {

// @Autowired
// private GridFsTemplate gridFsTemplate;

// public String savePhoto(MultipartFile file) throws IOException {
// ObjectId id = gridFsTemplate.store(
// file.getInputStream(),
// file.getOriginalFilename(),
// file.getContentType());
// return id.toString();
// }

// public byte[] getPhoto(String id) throws IOException {
// GridFSFile file = gridFsTemplate.findOne(new
// Query(Criteria.where("_id").is(new ObjectId(id))));
// if (file == null) {
// throw new FileNotFoundException("Photo not found with id: " + id);
// }
// GridFsResource resource = gridFsTemplate.getResource(file);
// return resource.getInputStream().readAllBytes();
// }
// }
