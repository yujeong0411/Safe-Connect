package c207.camference.api.service.openapi;

import c207.camference.api.response.openapi.AedResponse;
import c207.camference.db.entity.etc.Aed;
import c207.camference.db.repository.openapi.AedRepository;
import lombok.RequiredArgsConstructor;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import static c207.camference.util.openapi.OpenApiUtil.convertXmlToJson;

@Service
@RequiredArgsConstructor
public class AedService {

    private final AedRepository aedRepository;

    @Value("${openApi.aedUrl}")
    private String aedUrl;

    @Value("${openApi.serviceKey}")
    private String serviceKey;

    public void saveAed() {
        int numOfRows = 100;
        int pageNo = 1;

        while (true) {

            try {
                String urlStr = aedUrl + "?serviceKey=" + serviceKey
                        + "&numOfRows=" + numOfRows + "&pageNo=" + pageNo;

                JSONObject jsonResponse = convertXmlToJson(urlStr);
                // JSON 데이터 추출
                JSONObject response = jsonResponse.optJSONObject("response");
                if (response == null) {
                    // response가 null이면 종료
                    break;
                }

                JSONObject body = response.optJSONObject("body");
                if (body == null) {
                    // body가 null이면 종료
                    break;
                }

                // items가 null일 경우 처리
                JSONObject itemsObj = body.optJSONObject("items");
                if (itemsObj == null) {
                    // items가 null이면 종료
                    break;
                }

                Object itemObj = itemsObj.opt("item");
                JSONArray items;
                if (itemObj instanceof JSONArray) {
                    items = (JSONArray) itemObj;
                } else if (itemObj instanceof JSONObject) {
                    items = new JSONArray().put(itemObj);
                } else {
                    // item이 없으면 종료
                    break;
                }


                List<Aed> aeds = new ArrayList<>();
                for (int i = 0; i < items.length(); i++) {
                    JSONObject item = items.optJSONObject(i);

                    Aed aed = new Aed();
                    aed.setAedAddress(item.optString("buildAddress", "정보 없음"));
                    aed.setAedLatitude(item.optDouble("wgs84Lat", 0.0));
                    aed.setAedLongitude(item.optDouble("wgs84Lon", 0.0));

                    aeds.add(aed);
                }

                if (!aeds.isEmpty()) {
                    aedRepository.saveAll(aeds);
                    pageNo++;
                } else {
                    break;
                }

            } catch (IOException e) {
                e.printStackTrace();
                break;
            }
        }
    }

    public List<AedResponse> getAedsNearBy(double lat, double lon) {
        List<Aed> aeds = aedRepository.findAedsWithin1Km(lat, lon);
        return aeds.stream()
                .map(aed -> new AedResponse(aed.getAedId(), aed.getAedAddress(), aed.getAedLatitude(), aed.getAedLongitude()))
                .collect(Collectors.toList());
    }
}