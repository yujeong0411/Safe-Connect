<details>
  <summary><h3 style="display: inline; margin-left: 5px;">2025.1.13.</h3></summary>

# CI/CD란?
- CI (Continuous Integration, 지속적인 통합) 
	- 개발자들이 작성한 코드들을 중앙 저장소에 통합하는 프로세스. 각 통합 시 자동화된 빌드와 테스트가 실행되어 코드를 지속적으로 검증한다. 

- CD(Continuous Deployment/Delivery, 지속적인 배포/지속적인 제공) 
	- **Continuous Delivery (지속적인 제공):** CI 이후의 과정을 자동화하여, 검증된 코드를 언제든지 프로덕션 환경에 배포할 준비를 갖추는 단계입니다.
	- **Continuous Deployment (지속적인 배포) :** Continuous Delivery의 한 단계 더 나아가, 모든 검증된 변경 사항을 자동으로 프로덕션 환경에 배포하는 것을 의미합니다.

<hr>
**대표적인 CI/CD 구조도**
https://learnote-dev.com/assets/images/tech/Java/2022-06-12-[Spring]%EC%A0%A0%ED%82%A8%EC%8A%A4/image1.PNG
# CI/CD 파이프라인 개요 

- 코드 작성 및 코드 푸시
	- 개발자가 GitLab 저장소에 코드를 푸시한다.
- 코드 변경 감지
	- GitLab은 설정된 webhook을 통해서 Jenkins에 코드 변경을 알린다.
- 빌드 및 테스트 자동화
- 컨테이너 이미지 생성
	- 빌드가 성공하면, Jenkins는 Docker를 사용해 변경된 애플리케이션의 Docker 이미지를 생성한다.
- 이미지 저장소에 푸시
	- 생성된 Docker 이미지는 Docker Registry에 푸시된다.
- 배포 자동화
	- Jenkins는 최신 Docker 이미지를 AWS EC2 인스턴스로 배포한다. 
	- 배포된 애플리케이션은 EC2에서 Docker Container로 실행된다.
- 운영 및 모니터링
	- 모니터링 도구를 통해서 애플리케이션의 상태가 지속적으로 모니터링되며, 필요시 Jenkins를 통해 추가적인 자동화 작업이 실행된다. 

<hr>

# 쓰이는데 필요한 도구
## GitLab
- 프로젝트 저장소 역할
- **Webhook**설정
	- GitLab에 올라온 코드가 변경되었을 때, 변경되었음을 Jenkins에게 알리는 설정
	- [설정방법](https://velog.io/@suhongkim98/jenkins-%EC%9B%B9%ED%9B%85-%EC%84%A4%EC%A0%95%ED%95%B4%EC%84%9C-CI-%EA%B5%AC%EC%B6%95%ED%95%98%EA%B8%B0)

## Jenkins
- 코드 푸시 및 변경 감지
- Jenkins는 CI/CD 파이프라인의 중심 역할을 하는 자동화 서버이다. CI/CD의 핵심.
- GitLab에 코드가 푸시되면, Jenkins가 이를 감지하고 빌드 프로세스를 시작한다. 

## EC2
- AWS에서 제공하는 가상 서버. 이 위에 Docker를 설치하고, 그 위에 Jenkins를 설치하고 설정한다(아마도). 

## Docker
- 애플리케이션을 컨테이너화하여 일관된 환경에서 빌드, 테스트, 배포를 가능하게 한다. Jenkins와 Docker를 연동하면 빌드 환경을 표준화할 수 있다. 

### 즉, EC2 서버를 일단 만들고, 그 위에 도커를 설치하고, 그 도커 컨테이너중 하나로 Jenkins를 설치하고, dockercompose 파일로 다루는 설정을 하면 되..려나? ㅎ


<hr>


</details>
