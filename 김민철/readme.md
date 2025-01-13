# 김민철

## 20250113
<details class = "first">
    <summary>
    <b>왜 Spring Boot을 사용하는가?</b>
    </summary>

<ul>
    <li>
    Spring VS Spring Boot
    </li>
    <p>
둘다 Java 웹 개발 프레임워크이다.<br/>
    Spring은 설정을 개발자가 직접 작성하여 스프링 컨테이너를 구성하고, 필요한 bean객체를 등록하고, 빈 객체간의 의존성을 설정한다.Spring은 특정 구성을 위해 추가적인 라이브러리와 설정이 필요하다.<br/>
    But, Spring Boot는 보다 쉽게 사용할 수 있도록 만든 프레임워크이다. Spring MVC, 스프링 Data JPA, 스프링 Security 등 다양한 기능을 자동으로 설정하며, 개발자가 별도로 설정 파일을 작성하지 않아도 된다.<br/>
    </p>
    <li>
    Spring Boot JPA(Java Persistance API)
    </li>
    <p>
    Java ORM 기술 표준으로 사용하는 인터페이스 모음이다.

1. **JPA는 반복적인 CRUD SQL을 처리**해준다.
   JPA는 매핑된 관계를 이용해 SQL을 생성하고 실행한다.
   MyBatis를 이용하면 **간단한 CRUD 쿼리를 모두 작성**해줘 생산성을 높일 수 있다.

2. **객체 중심으로 개발이 가능**하다.
   JPA를 활용하면 SQL이 아닌 객체 중심으로 개발할 수 있다.
   테이블에 매핑되는 클래스를 더 객체 지향적으로 개발할 수 있다.
   **객체 지향 언어인 Java**에 더 적합하고, **생산 및 유지보수에 수월**하다.
</p>
</ul>


</details>