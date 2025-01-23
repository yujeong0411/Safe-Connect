package c207.camference.api.contoller.medi;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

import org.json.JSONObject;
import org.json.XML;

@RestController
@RequestMapping("/api")
public class DiseaseApiController {

    @Value("${openApi.serviceKey}")
    private String serviceKey;

    @Value("${openApi.diseaseUrl}")
    private String diseaseUrl;

    @GetMapping("/disease")
    public ResponseEntity<String> callDiseaseApi(
            @RequestParam(value = "numOfRows") Integer numOfRows,
            @RequestParam(value = "sickType") String sickType,
            @RequestParam(value = "medTp") String medTp,
            @RequestParam(value = "diseaseType") String diseaseType
//            @RequestParam(value = "searchText") String searchText
    ) {
        HttpURLConnection urlConnection = null;
        InputStream stream = null;
        String result = null;

        // postman 요청시 파라미터에 numOfRows=2065, sickType: 1, medTp: 1, diseaseType: SICK_CD
        String urlStr = diseaseUrl +
                "?serviceKey=" + serviceKey +
                "&numOfRows=" + numOfRows +
                "&sickType=" + sickType +
                "&medTp=" + medTp +
                "&diseaseType=" + diseaseType;

        try {
            URL url = new URL(urlStr);

            urlConnection = (HttpURLConnection) url.openConnection();
            stream = getNetworkConnection(urlConnection);
            result = readStreamToString(stream);

            if (stream != null) {
                stream.close();
            }

            // XML -> JSON
            JSONObject jsonObj = XML.toJSONObject(result);
            String jsonString = jsonObj.toString();

            // JSON 포맷팅
            ObjectMapper mapper = new ObjectMapper();
            mapper.enable(SerializationFeature.INDENT_OUTPUT);
            Object json = mapper.readValue(jsonString, Object.class);
            result = mapper.writerWithDefaultPrettyPrinter().writeValueAsString(json);

        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            if (urlConnection != null) {
                urlConnection.disconnect();
            }
        }
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    // URLConnection을 전달받아 연결정보 설정 후 연결, 연결 후 수신한 InputStream 반환
    private InputStream getNetworkConnection(HttpURLConnection urlConnection) throws IOException {
        urlConnection.setRequestMethod("GET");
        urlConnection.setDoInput(true);

        // 에러 확인용
        if (urlConnection.getResponseCode() != HttpURLConnection.HTTP_OK) {
            throw new IOException("HTTP error code: " + urlConnection.getResponseCode());
        }
        return urlConnection.getInputStream();
    }

    // InputStream을 전달받아 문자열로 변환 후 반환
    private String readStreamToString(InputStream stream) throws IOException {
        StringBuilder result = new StringBuilder();

        // 바이트 -> 문자
        BufferedReader br = new BufferedReader(new InputStreamReader(stream, "UTF-8"));

        String readLine; // 각 줄의 내용 저장
        while ((readLine = br.readLine()) != null) {
            result.append(readLine + "\n\r");
        }

        br.close();

        return result.toString();
    }
}
