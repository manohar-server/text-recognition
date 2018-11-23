package com.softfeels.imageprocessor.textextractorfromimage.controller;

import com.softfeels.imageprocessor.textextractorfromimage.models.UploadFileResponse;
import com.softfeels.imageprocessor.textextractorfromimage.services.FileStorageService;
import net.sourceforge.tess4j.ITesseract;
import net.sourceforge.tess4j.Tesseract;
import net.sourceforge.tess4j.TesseractException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.File;
import java.io.UnsupportedEncodingException;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.bytedeco.javacpp.*;
import static org.bytedeco.javacpp.lept.*;
import static org.bytedeco.javacpp.tesseract.*;

@RestController
@RequestMapping("/api/")
public class AuthController {

	@Autowired
	private FileStorageService fileStorageService;

	public String getImgText(String imageLocation) {

		ITesseract instance = new Tesseract();

		try

		{
			instance.setLanguage("eng");
			instance.setDatapath("/usr/share/tesseract-ocr/4.00/tessdata/");
			String imgText = instance.doOCR(new File(imageLocation));
			return imgText;

		}

		catch (TesseractException e) {
			e.getMessage();

			return "Error while reading image";

		}

	}

	@GetMapping("extract")
	public String testimage() {
		return test("/home/manohar/Desktop/test.jpg");
	}

	@PostMapping("/uploadFile")
	public UploadFileResponse uploadFile(@RequestParam("file") MultipartFile file) {
		String fileName = fileStorageService.storeFile(file);

//		String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath().path("/downloadFile/")
//				.path(fileName).toUriString();

		String text = getImgText(fileName);
		String[] lines = text.split(System.getProperty("line.separator"));
		String model = "Not Found, Plz Select High Resolution Image";
		String year = "Not Found, Plz Selecte Hight Resolution Image";
		String modelAndYear = "Not Found, Plz Selecte Hight Resolution Image";
		for (int i = 0; i < lines.length; i ++) {
			if(lines[i].startsWith("Model")) {
				modelAndYear = lines[i].substring(lines[i].lastIndexOf(" "));
				String tokens[] = modelAndYear.split("/");
				if(tokens.length == 2) {
					model = tokens[0];
					year = tokens[1];
				} else {
					tokens = modelAndYear.split("I");
					if(tokens.length == 2) {
                                        	model = tokens[0];
                                        	year = tokens[1];
                                	} else{
						model = modelAndYear;
					}
				}
				break;
			}
			System.out.println(lines[i]);
		}
		return new UploadFileResponse(model, year, text, modelAndYear);
		
	}

	@PostMapping("/uploadMultipleFiles")
	public List<UploadFileResponse> uploadMultipleFiles(@RequestParam("files") MultipartFile[] files) {
		return Arrays.asList(files).stream().map(file -> uploadFile(file)).collect(Collectors.toList());
	}
	
	public String test(String path) {
		String text = "";
        BytePointer outText;

        TessBaseAPI api = new TessBaseAPI();
        
        // Initialize tesseract-ocr with English, without specifying tessdata path
        if (api.Init(null, "eng") != 0) {
            System.err.println("Could not initialize tesseract.");
            System.exit(1);
        }

        // Open input image with leptonica library
        PIX image = pixRead("/home/manohar/Desktop/test.jpg");
        api.SetImage(image);
        // Get OCR result
        outText = api.GetUTF8Text();
        text = outText.getString();
        try {
			System.out.println("OCR output:\n" + outText.getString("utf-8"));
		} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

        // Destroy used object and release memory
        api.End();
        outText.deallocate();
        pixDestroy(image);
        return text;
    }

}
