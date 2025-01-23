package c207.camference.util.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import c207.camference.api.response.common.ResponseData;
import org.springframework.http.HttpStatus;

@Data
@AllArgsConstructor
@Builder
public class ResponseUtil<T> {


    public static <T> ResponseData<T> success(T data, String message) {
        return ResponseData.<T>builder()
                .isSuccess(true)
                .code(HttpStatus.OK.value())
                .message(message)
                .data(data)
                .build();
    }

    public static <T> ResponseData<T> success(String message) {
        return ResponseData.<T>builder()
                .isSuccess(true)
                .code(HttpStatus.OK.value())
                .message(message)
                .data(null)
                .build();
    }

    // 실패 응답 생성 (데이터 없이)
    public static ResponseData<Void> fail(int code, String message) {
        return ResponseData.<Void>builder()
                .isSuccess(false)
                .code(code)
                .message(message)
                .data(null)
                .build();
    }

    // 실패 응답 생성 (데이터 포함)
    public static <T> ResponseData<T> fail(int code, String message, T data) {
        return ResponseData.<T>builder()
                .isSuccess(false)
                .code(code)
                .message(message)
                .data(data)
                .build();
    }
}
