package c207.camference.api.service.geocoding;

import c207.camference.api.dto.geocoding.KakaoGeoResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
public class GeocodingService {
    @Value("${kakao.apiUrl}")
    private String kakaoApiUrl;
    @Value("${kakao.apiKey}")
    private String kakaoApiKey;

    private final RestTemplate restTemplate;

    public String reverseGeocoding(Double lat, Double lon) {
        String url = kakaoApiUrl + "?x=" + lon + "&y=" + lat;

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "KakaoAK " + kakaoApiKey);

        HttpEntity<?> entity = new HttpEntity<>(headers);

        try {
            ResponseEntity<KakaoGeoResponseDto> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    entity,
                    KakaoGeoResponseDto.class
            );

            KakaoGeoResponseDto body = response.getBody();
            if (body != null && !body.getDocuments().isEmpty()) {
//                return body.getDocuments().get(0).getRoadAddress().getAddressName();
                KakaoGeoResponseDto.Document document = body.getDocuments().get(0);

                // 도로명 주소 없으면 지번 주소로
                if (document.getRoadAddress() != null) {
                    return document.getRoadAddress().getAddressName();
                } else if (document.getAddress() != null) {
                    return document.getAddress().getAddressName();
                } else {
                    throw new IllegalArgumentException("주소 정보를 찾을 수 없습니다");
                }
            } else {
                throw new IllegalArgumentException("해당 위치의 주소 정보를 찾을 수 없습니다");
            }
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("역지오코딩 요청 중 오류 발생: " + e.getMessage(), e);
        }
    }
}
