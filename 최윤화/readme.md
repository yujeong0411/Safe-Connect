# 최윤화

## 20250113

<details class = "first">
    <summary>
    <b>왜 JPA를 사용하는가?</b>
    </summary>

        # JPA란?
        Java Persistence API의 약자로, ORM(Object-Relational-Mapping) 기술 표준으로 사용되는 인터페이스의 모음이다.
        Java를 사용해 관계형 데이터베이스를 사용하는 방식을 정의한 인터페이스로,
        SQL을 사용하지 않아도 Database의 CRUD가 가능하다는 특징이 있다.

        ---

        ## ORM (Object-Relational Mapping)
        - 일반적으로 알고 있는 **Class**와 **Database의 Table**을 연결한다는 의미이다.
        - Java의 Class를 RDB(Relational Database)의 Table로, 해당 Class가 가진 속성을 Column으로, 객체들을 Table의 Row로 연결해준다.
        - JPA를 구현한 ORM 프레임워크 중 대표적으로 **Hibernate**가 있다.

        ---

        ## JPA 장점
        1. **SQL문을 몰라도 Method 조작으로 CRUD 수행 가능**
        - 개발자는 비즈니스 로직에만 집중할 수 있다.

        2. **Mapping 정보가 Class에 정의**
        - 설계도에 대한 의존도를 낮출 수 있고, 유지보수와 재설계에 유리하다.
        - Table에 변경이 생겨도 Query문을 수정할 필요 없이 Class만 수정하면 된다.

        3. **Database 간 SQL 형식 차이 무시 가능**
        - 자체 SQL문을 사용해 MySQL과 PostgreSQL 간의 SQL 형식 차이가 있어도 설정 정보만 수정하면 문제없이 작동한다.

        4. **간결한 코드와 높은 가독성**
        - Query와 같은 선언문, 할당 등의 부수적인 코드가 줄어들어 각종 객체에 대한 코드를 별도로 작성하지 않아도 된다.

        ---

        ## JPA 단점
        1. **설계가 잘못될 경우 문제 발생**
        - 속도 저하 및 일관성이 무너질 수 있다.

        2. **복잡한 Query 처리 한계**
        - Method 단위에서 처리하지 못하는 복잡한 Query는 결국 SQL문을 직접 작성해야 한다.

        ---

        ## Spring에서 JPA 사용하기
        Spring 프레임워크를 사용할 때 Database와 연결하는 경우가 많다.
        이때 JPA를 사용해 개발하는 경우가 흔하며, Spring에서는 이를 쉽게 사용할 수 있도록 **Spring Data JPA** 모듈을 제공한다.
        이 모듈을 통해 JPA를 더욱 간편하게 사용할 수 있다.

</details>

## 20250114

<details class = "first">
    <summary>
    <b>WEB RTC - Openvidu 란 무엇인가?</b>
    </summary>

        # webRTC(Web Real-Time Communication)

        웹 브라우저가 서로 통신할 수 있도록 설계된 API
        웹 브라우저 상에서는 어떠한 플러그인도 필요 없이 음성 채팅과 화상채팅, 
        데이터 교환까지도 가능하게 하는 기술
        WebRTC 기술은 P2P(Peer-to-Peer) 통신에 최적화

        ---

        ## 시그널링(Signaling)

        RTCPeerConnection들이 적절하게 데이터를 교환할 수 있게 처리해 주는 과정
        이를 수행하는 서버 = 시그널 서버
        전이중 통신을 지원하는 websocket 으로 이를 구현하는 것이 가장 적합
        세션제어메세지, 네트워크 구성, 미디어 기능 정보 교환
        시그널링은 P2P 스트리밍 시작 전에 성공적으로 완료되어야 함

        세션 제어 메세지 : 통신을 초기화하거나 닫고 오류를 보고
        네트워크 구성 : 외부세계에 컴퓨터의 IP 주소와 포트는 무엇인지 파악
        미디어 기능 : 브라우저와 통신하려는 브라우저에서 처리할 수 있는 코덱과 해상도는 무엇인지 파악

        ---

        ## 서버

        서버는 단지 웹 브라우저를 특정하기 위한 시그널링(Signaling)과정으로만 쓰임
        시그널링을 마친 뒤 실제 데이터는 P2P 혹은 중개 서버를 통해 주고받음
        서버에서는 websocket(TCP) 사용 (cf. webRTC는 UDP)

        ---

        ## openVidu란?
        
        웹 또는 모바일 애플리케이션에서 화상 통화를 쉽게 추가할 수 있는 플랫폼
        Kurento기반의 중개 서버를 애플리케이션에 쉽게 추가할 수 있도록 완전한 기술스택을 제공
        Kurento : WebRTC 미디어 서버 역할을 함과 동시에 WebRTC 기술을 이용해 애플리케이션 개발을 돕는 
        클라이언트 API세트
        ---

</details>
