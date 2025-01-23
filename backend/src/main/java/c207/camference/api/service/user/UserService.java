package c207.camference.api.service.user;


import c207.camference.api.request.user.UserCreateRequest;

// 필요한 기능들을 interface로 작성 -> 이를 관련 Impl(구현체)과 연결해서 사용
// 이렇게 하는 이유는 유지보수의 용이, 유연성, 테스트 가능성이 향상된다.
public interface UserService {
    void createUser(UserCreateRequest request);
    Boolean validEmail(String userEmail);
}
