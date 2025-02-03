package c207.camference.util.openapi;

import org.json.JSONArray;
import org.json.JSONObject;
import org.json.XML;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

// 외부 api 데이터 사용시 공통 메서드 모음
public class OpenApiUtil {


    // 외부 api로부터 XML 데이터 받아와서 JSON 형식으로 변환
    public static JSONObject convertXmlToJson(String urlStr) throws IOException {
        HttpURLConnection urlConnection = null; // URL에 연결할 때 사용할 HTTP 연결 담당
        JSONObject jsonResponse = null; // JSON 객체 미리 생성해둠

        try {
            // URL 객체 만들고, HTTP 연결. HttpURLConnection으로 형변환해서 HTTP 전용 메서드 사용할 수 있도록 함
            urlConnection = (HttpURLConnection) new URL(urlStr).openConnection();
            urlConnection.setRequestMethod("GET");

            // HTTP 호출해서 응답 코드 확인했는데, 200 OK가 아니면 예외처리 + 상태 코드(실패 이유)
            if (urlConnection.getResponseCode() != HttpURLConnection.HTTP_OK) {
                throw new RuntimeException("Failed : HTTP error code : " + urlConnection.getResponseCode());
            }

            try (BufferedReader br = new BufferedReader(new InputStreamReader(urlConnection.getInputStream()))) {
                StringBuilder response = new StringBuilder();
                String line;
                while ((line = br.readLine()) != null) {
                    response.append(line);
                }
                // XML -> JSON
                return XML.toJSONObject(response.toString());
            }
        } finally {
            if (urlConnection != null) {
                urlConnection.disconnect();
            }
        }
    }

    // HTTP GET 요청 -> 응답
    public static String getHttpResponse(String urlStr) throws IOException {
        HttpURLConnection urlConnection = null;
        try {
            urlConnection = (HttpURLConnection) new URL(urlStr).openConnection();
            urlConnection.setRequestMethod("GET");

            if (urlConnection.getResponseCode() != HttpURLConnection.HTTP_OK) {
                throw new RuntimeException("Failed : HTTP error code : " + urlConnection.getResponseCode());
            }

            try (BufferedReader br = new BufferedReader(new InputStreamReader(urlConnection.getInputStream()))) {
                StringBuilder response = new StringBuilder();
                String line;
                while ((line = br.readLine()) != null) {
                    response.append(line);
                }
                return response.toString();
            }
        } finally {
            if (urlConnection != null) {
                urlConnection.disconnect();
            }
        }
    }


    // 받아온 데이터에서 items 추출하기 (배열 형식으로)
    // 현재 외부 api 데이터 형식이 response -> body -> items -> item(필요한값) 으로 동일
    public static JSONArray extractItems(JSONObject response) {
        JSONObject body = response.optJSONObject("response")
                .optJSONObject("body")
                .optJSONObject("items");

        if (body == null) {
            return new JSONArray(); // NullPointerException 방지
        }

        // opt(): 해당 키가 없을 경우 null 반환
        Object item = body.opt("items");
        if (item instanceof JSONArray) {
            return (JSONArray) item; // item이 배열이면 배열 그대로 반환
        } else if (item instanceof JSONObject) {
            return new JSONArray().put(item); // item이 객체면 객체를 배열 형태로 감싸서 반환
        }
        return new JSONArray();
    }
}
