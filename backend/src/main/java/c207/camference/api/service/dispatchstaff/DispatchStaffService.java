package c207.camference.api.service.dispatchstaff;

import c207.camference.api.response.dispatchstaff.AvailableHospitalResponse;
import org.json.JSONArray;
import org.json.JSONObject;
import org.json.XML;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.List;

@Service
public class DispatchStaffService {

    @Value("${openApi.serviceKey}")
    private String serviceKey;

    @Value("${openApi.availableHospitalUrl}")
    private String availableHospitalUrl;

    public List<AvailableHospitalResponse> getAvailableHospital(String siDo, String siGunGu) {
        List<AvailableHospitalResponse> responses = new ArrayList<>();
        HttpURLConnection urlConnection = null;

        try {
            String urlStr = availableHospitalUrl +
                    "?ServiceKey=" + serviceKey +  // serviceKey는 인코딩하지 않음
                    "&STAGE1=" + URLEncoder.encode(siDo, "UTF-8") +
                    "&STAGE2=" + URLEncoder.encode(siGunGu, "UTF-8");

            urlConnection = (HttpURLConnection) new URL(urlStr).openConnection();
            urlConnection.setRequestMethod("GET");

            if (urlConnection.getResponseCode() != HttpURLConnection.HTTP_OK) {
                throw new RuntimeException("Failed : HTTP error code : " + urlConnection.getResponseCode());
            }

            JSONObject jsonResponse;
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(urlConnection.getInputStream()))) {
                StringBuilder sb = new StringBuilder();
                String line;
                while ((line = reader.readLine()) != null) {
                    sb.append(line);
                }
                jsonResponse = XML.toJSONObject(sb.toString());
            }

            JSONObject body = jsonResponse.optJSONObject("response")
                    .optJSONObject("body")
                    .optJSONObject("items");

            if (body == null) {
                return responses;
            }

            Object itemObj = body.opt("item");
            JSONArray items;
            if (itemObj instanceof JSONArray) {
                items = (JSONArray) itemObj;
            } else if (itemObj instanceof JSONObject) {
                items = new JSONArray().put(itemObj);
            } else {
                return responses;
            }

            for (int i = 0; i < items.length(); i++) {
                JSONObject item = items.getJSONObject(i);

                AvailableHospitalResponse response = AvailableHospitalResponse.builder()
                        .hospitalName(item.optString("dutyName", "정보 없음"))
                        .hospitalPhone(item.optString("dutyTel3", "연락처 없음"))
                        .hospitalCapacity(item.has("hvec") ? item.optInt("hvec") : -1)
                        .build();

                responses.add(response);
            }

        } catch (Exception e) {
            throw new RuntimeException("병원 정보 조회 중 오류 발생", e);
        } finally {
            if (urlConnection != null) {
                urlConnection.disconnect();
            }
        }
        return responses;
    }
}
