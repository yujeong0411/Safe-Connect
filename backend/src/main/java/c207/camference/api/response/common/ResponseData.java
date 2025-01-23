package c207.camference.api.response.common;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class ResponseData<T> {
    private Boolean isSuccess; // 요청 성공 여부
    private int code;          // HTTP 상태 코드
    private String message;    // 응답 메시지

    @JsonInclude(JsonInclude.Include.NON_NULL)//만일 null이면 안 뜨도록
    private T data;            // 응답 데이터 (제네릭)
}