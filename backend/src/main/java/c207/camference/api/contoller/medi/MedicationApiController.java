package c207.camference.api.contoller.medi;

import c207.camference.api.service.medi.MediService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;


@RestController
@RequestMapping("/api")
public class MedicationApiController {

    private final MediService mediService;
    @Value("${openApi.serviceKey}")
    private String serviceKey;

    @Value("${openApi.medicationUrl}")
    private String medicationUrl;

    @Value("${openApi.dataType}")
    private String dataType;

    public MedicationApiController(MediService mediService) {
        this.mediService = mediService;
    }

    @GetMapping("/medication")
    public ResponseEntity<String> fetchAndSaveMedicationData() {

        try {
            int pageNo = 1;
            int numOfRows = 300;

            while (true) {
                // 외부 API 호출
                String apiResponse = fetchDataFromApi(pageNo, numOfRows);

                // JSON 응답에서 ITEM_NAME 리스트 추출
                List<String> mediNames = extractItemNames(apiResponse);

                if (mediNames.isEmpty()) {
                    break;
                }
                // Service 호출해서 데이터 저장
                mediService.saveMedicationData(mediNames);

                pageNo++; // 다음 페이지로
            }

            return new ResponseEntity<>("데이터 저장 성공", HttpStatus.OK);

        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("Error: ", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private List<String> extractItemNames(String apiResponse) throws Exception {
        List<String> mediNames = new ArrayList<>();
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode rootNode = objectMapper.readTree(apiResponse);

        // JSON에서 body.items[].ITEM_NAME 추출
        JsonNode itemsNode = rootNode.path("body").path("items");
        if (itemsNode.isArray()) {
            for (JsonNode itemNode : itemsNode) {
                String itemName = itemNode.path("ITEM_NAME").asText();
                mediNames.add(itemName);
            }
        }
        return mediNames;
    }

    private String fetchDataFromApi(int pageNo, int numOfRows) throws Exception {
        String urlStr = medicationUrl +
                "?serviceKey=" + serviceKey +
                "&pageNo=" + pageNo +
                "&numOfRows=" + numOfRows +
                "&type=" + dataType;

        HttpURLConnection urlConnection = (HttpURLConnection) new URL(urlStr).openConnection();
        urlConnection.setRequestMethod("GET");

        if (urlConnection.getResponseCode() != HttpURLConnection.HTTP_OK) {
            throw new RuntimeException("Failed : HTTP error code : " + urlConnection.getResponseCode());
        }

        try (InputStream inputStream = urlConnection.getInputStream()){
            return new String(inputStream.readAllBytes());
        } finally {
            urlConnection.disconnect();
        }
    }
}
