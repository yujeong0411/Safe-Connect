package c207.camference.api.contoller.medi;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;


@RestController
@RequestMapping("/api")
public class MediApiController {

    @Value("${openApi.serviceKey}")
    private String serviceKey;

    @Value("${openApi.callBackUrl}")
    private String callBackUrl;

    @Value("${openApi.dataType}")
    private String dataType;

    // API 호출
    @GetMapping("/forecast")
    public ResponseEntity<String> callForecastApi() {
        HttpURLConnection urlConnection = null;
        InputStream stream = null;
        String result = null;

        String urlStr = callBackUrl + "?serviceKey=" + serviceKey + "&type=" + dataType;

        try {
            URL url = new URL(urlStr);

            urlConnection = (HttpURLConnection) url.openConnection();
            stream = getNetworkConnection(urlConnection);
            result = readStreamToString(stream);

            if (stream != null) {
                stream.close();
            }
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
