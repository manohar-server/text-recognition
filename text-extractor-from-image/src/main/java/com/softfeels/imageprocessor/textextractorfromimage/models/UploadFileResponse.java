package com.softfeels.imageprocessor.textextractorfromimage.models;

import com.fasterxml.jackson.annotation.JsonIgnore;

public class UploadFileResponse {
    private String model;


    private String year;

    private String raw;

    private String size;

    public UploadFileResponse(String model, String year, String raw, String size) {
        this.model = model;
        this.year = year;
        this.raw = raw;
        this.size = size;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public String getYear() {
        return year;
    }

    public void setYear(String year) {
        this.year = year;
    }

    public String getRaw() {
        return raw;
    }

    public void setRaw(String raw) {
        this.raw = raw;
    }

    public String getSize() {
        return size;
    }

    public void setSize(String size) {
        this.size = size;
    }
}

