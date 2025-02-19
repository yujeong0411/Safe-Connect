package c207.camference.api.dto.geocoding;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class KakaoGeoResponseDto {
    private List<Document> documents;

    @Getter
    @Setter
    public static class Document {
        private Address roadAddress;
        private Address address;
    }

    @Getter
    @Setter
    public static class Address {
        @JsonProperty("address_name")
        private String addressName;
    }
}
