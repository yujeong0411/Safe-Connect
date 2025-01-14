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
    
</ul>

</details>
<details>
   <summary>
<b>Spring Boot JPA(Java Persistance API)를 왜 사용하는가?</b>
</summary>

<ul>
<li>
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
</li>
</ul>
</details>

## 20250114

<details>
    <summary>
        <b>왜 PjM을 해야하는가?</b>
    </summary>
    <ul>
        <li>
            <b>Project Manager의 역할 : </b><br/><br/>
            <p>
               <b>1. 일이 되게 하는 사람(기획자)</b> <br/> 프로젝트의 A~Z까지의 모든 프로세스와 이해관계자의 이해를 바탕으로 프로젝트를 수행한다. 개인 업무별 그리고 전체 프로젝트의 일정 관리책임을 가지고 있다.<br/><br/>
               <b>2. 멤버를 어울리게 하는 사람(조율자)</b> <br/> 동료들의 문제를 진단/파악하고 가시화하여 함께 문제를 해결할 수 있도록 지원한다. <br/><br/>
               <b>3. 잠재적 위험을 미리 접근하는 사람(선발대)</b> <br/> 잠재적 위험을 조기에 파악하고, 가능한 영향을 분석하며, 완화할 전략을 개발한다. 프로젝트 일정, 품질 및 예산에 대한 중단을 최소화한다. <br/><br/>
               <b>4. 프로젝트 예산을 감리하는 사람(회계사)</b> <br/>가능한 모든 비용을 추산하고, 예산을 수립하고, 지출을 추적하며, 재정적 효율성을 달성하고 재정적 범위 내에 있도록 조정한다.<br/><br/>
               <b>5. 품질 기준 유지하는 사람(기준!!!)</b> <br/> 프로젝트의 시작부터 완성까지 완성도의 중심을 잡고 잘 유지해줘야한다.<br/><br/>
            </p>
        </li>
        <li>
            <b>갈등관리 전략</b><br/><br/>
            <p>
            <img src="src/strategy.png" width="400" height="400"><br/>
            <img src="src/ProblemSolving.png" width="300" height="300"><br/>
            <img src="src/Forcing.png" width="300" height="300"><br/>
            <img src="src/Comparing.png" width="300" height="300"><br/>
            <img src="src/Accommodating.png" width="300" height="300"><br/>
            </p>
        </li>
    </ul>

</details>
