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

<details>
  <summary><h3 style="display: inline; margin-left: 5px;">2025.1.14.</h3></summary>
참고자료
[[AWS] EC2 서버 구축하기](https://velog.io/@somm/AWS-EC2-%EC%84%9C%EB%B2%84-%EA%B5%AC%EC%B6%95%ED%95%98%EA%B8%B0#-0-vpc-%EC%83%9D%EC%84%B1)

# EC2 인스턴스 생성

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/321f21f6-094d-4367-9c5d-4ba675a0f14f/a27e9f71-0486-460d-8d5f-fd0b5f36c7ab/image.png)

자세한건 참고자료의 링크를 참조하자. 위와같이 인스턴스가 생성된다면 성공.
EC2는 Heroku와 같은 서비스와 달리, 무한히 쓰면 무한히 비용이 청구되는 끔찍한 체계이다.

따라서, 이거 처음 생성할때 정신 똑바로 차리고 생성하자.
<hr>

# 보안키 생성

## .pem vs .ppk

- 맥북에서는 pem 파일로 key를 만들고 나서 바로 ssh 문을 통해 실행을 할 수 있었지만, 윈도우는 그렇지 않았다.
- 먼 과거, 윈도우에서는 ppk파일로 key파일을 만들고 나서 putty를 설치해서 변환하고 어쩌구저쩌구를 해야 했다고 한다.
- 그런데 이제 마이크로소프트가 윈도우 터미널을 보완해서 그렇게 하지 않아도 된다고 한다. 그냥 pem파일로 생성하고 로컬에서 관리를 하면 된다.

<hr>

# 탄력적 IP 생성

- AWS에서 인스턴스를 만들면, 해당 서버의 IP는 고정되어있지 않고 재시작하거나 중지가 될 떄마다 계속 유동적으로 바뀐다. 하지만 탄력적 IP를 쓴다면, **고정된 퍼블릭 IP**를 쓸 수 있게 된다.
- 따라서, 이를 생성한 다음, 방금 우리가 생성한 EC2 서버에 할당을 해야 한다.

<hr>

# (윈도우 한정) 보안 키(.pem) 보안 설정

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/321f21f6-094d-4367-9c5d-4ba675a0f14f/5509f70f-5e8e-4640-bb55-f21634067feb/image.png)

그냥 무작정 ssh 문을 실행하려고 하면, 위와 같은 에러문이 뜬다. 이는 발급받은 보안키의 허용 범위가 너무 넓어서, 보안떄문에 생기는 이슈이다. 따라서 아래와 같이 보안을 설정하는 작업이 필요하다.

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/321f21f6-094d-4367-9c5d-4ba675a0f14f/cf2c976c-b34c-49cc-a82e-060b7da9b646/image.png)

맨 밑 Authenticated Users, Users의 항목을 삭제해야 한다.

# ssh 문 실행

```
ssh -i "C:\\SSAFY\\AWS_EC2_key\\2025ssafyCICD.pem" ubuntu@ec2-13-124-195-234.ap-northeast-2.compute.amazonaws.com

```

위의 명령어를 git bash에서 실행하거나 windows terminal에서 실행한다.

꼭꼭꼭꼭꼭 파일 경로명을 제발 잘 설정하고 다시 확인하자. 진짜 파일 경로명 한글자 틀려서 30분 날렸다. 진짜 어이가 없네. 그런 파일 찾을 수 없다고 에러메시지라도 보여주던가.

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/321f21f6-094d-4367-9c5d-4ba675a0f14f/df8858e2-7587-46e1-a954-6e72c65d8c88/image.png)

성공하면 위와 같은 메시지가 뜬다.

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/321f21f6-094d-4367-9c5d-4ba675a0f14f/b083d357-043f-4429-95c8-46b065508c39/image.png)

이렇게, 콘솔의 유저명이 윈도우 유저가 아닌, ubuntu로 바뀐것을 알 수 있다. EC2 서버 환경에 들어온 것이다.

이제 여기에 도커를 설치하고, 도커위에 컨테이너를 생성하고, 그 컨테이너 위에 젠킨슨을 설치하면 된다.

<hr>

# Docker 설치방법

당연하지만, 아래의 과정은 꼭 EC2 서버가 아니더라도 모두 Linux 환경에서만 먹힙니당.

### 1. 우분투 시스템 패키지 업데이트

```
sudo apt-get update
```

### 2. 필요한 패키지 설치

```
sudo apt-get install apt-transport-https ca-certificates curl gnupg-agent software-properties-common
```

### 3. Docker의 공식 GPG키를 추가

```
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
```

### 4. Docker의 공식 apt 저장소를 추가

```
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
```

### 5. 시스템 패키지 업데이트

```
sudo apt-get update
```

### 6. Docker 설치

```
sudo apt-get install docker-ce docker-ce-cli containerd.io
```

### 7. Docker가 설치 확인

### 7-1 도커 실행상태 확인

```ebnf
sudo systemctl status docker
```

### 7-2 도커 실행

```
sudo docker run hello-world
```

<hr>

# ubuntu에서 도커 설치 후, 젠킨슨 이미지를 만들고 컨테이너로 실행하기까지의 과정

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/321f21f6-094d-4367-9c5d-4ba675a0f14f/e2a9d9a0-f89c-4b01-9c92-520e0d342fbd/image.png)

명령어를 하나씩 설명하자면,

```
groupadd -f docker
```

- **`groupadd`:** 새로운 그룹을 생성하는 명령어
- **`f`:** "force"의 약자로, 그룹이 이미 존재할 경우 오류를 발생시키지 않고 무시
- **`docker`:** 생성하려는 그룹의 이름

```
sudo usermod -aG docker ubuntu
```

- **`sudo`:** 관리자 권한으로 명령어를 실행
- **`usermod`:** 사용자의 속성을 수정하는 명령어
- **`aG docker`:** 사용자를 특정 그룹에 추가. 여기서:
    - **`a`:** "append"의 약자로, 사용자를 새로운 그룹에 추가할 때 기존 그룹을 유지합니다.
    - **`G docker`:** `docker` 그룹에 사용자를 추가합니다.
- **`ubuntu`:** 그룹에 추가하려는 사용자의 이름입니다. 일반적으로 Ubuntu 인스턴스에서 기본 사용자 이름이다. (참고 : 사용자 이름 확인 명령어 : `whoami`)

```
sudo docker run -d -p 9090:8080 -v /jenkins:/var/jenkins_home --name jenkins -u root -v /var/run/docker.sock:/var/run/docker.sock --privileged jenkins/jenkins
```

| 옵션 | 설명 |
| --- | --- |
| -d | 컨테이너를 백그라운드에서 실행 (detached 모드) |
| -p 9090:8080 | 호스트의 9090 포트를 컨테이너의 8080 포트에 매핑 |
| -v /jenkins:/var/jenkins_home | 호스트의 `/jenkins` 디렉토리를 컨테이너의 `/var/jenkins_home`에 마운트 |
| --name jenkins | 컨테이너의 이름을 `jenkins`로 지정 |
| -u root | 컨테이너 내부에서 `root` 사용자로 실행 |
| -v /var/run/docker.sock:/var/run/docker.sock | 호스트의 Docker 소켓을 컨테이너에 마운트, Docker 명령어 실행 가능하게 함 |
| --privileged | 컨테이너에 추가적인 권한 부여 (보안 위험 있음) |
| jenkins/jenkins | 사용하려는 Docker 이미지 (공식 Jenkins 이미지) |
- 즉, 이 명령어를 실행한다면, 추가로 무엇을 설치한다거나, docker hub에서 이미지를 따로 사용자가 추가로 가져오지 않고, 자동으로 젠킨슨 이미지를 docker에서 가져오는 것이다.
- 그리고 정말 당연한 이야기이지만, 컨테이너 내부의 8080포트를 호스트 서버의 9090포트에서 열어주기 때문에, **반드시 9090포트를 열어주어야 한다**. [AWS EC2 서버에서 포트 여는 방법](https://ruriruriya.tistory.com/60)

## 젠킨슨 접속

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/321f21f6-094d-4367-9c5d-4ba675a0f14f/5b61f854-2d66-409a-a08c-f5169f1d313c/image.png)

위의 과정을 거친다면,

http://13.124.195.234:9090/login?from=%2F
와 같이,

```
http://<할당받은 AWS공개 IP주소>/9090
```

주소를 통해서 실행한 젠킨슨 컨테이너에 접속을 할 수 있다.
이제 관리자 비밀번호를 설정하고, gitlab에 webhook 설정을 하고 연결..? 그런거 하면 될..듯?

아니 그리고 너무 찜찜한게, 왜 https가 아니라 http지...? 괜찮은건가 이거
</details>

<details>
  <summary><h3 style="display: inline; margin-left: 5px;">2025.1.15.</h3></summary>
# 관리자 비밀번호 가져오기

```
sudo cat /jenkins/secrets/initialAdminPassword
```

# 관리자 계정 생성
![image.png](./image.png)

![image-1.png](./image-1.png)
![image-2.png](./image-2.png)

---
# 필요한 플러그인 설치
Jenkins관리 -> plugins -> gitlab 검색 -> 필요한 플러그인들 설치
![image-3.png](./image-3.png)

```
설치할 플러그인 목록   
- Git  (안뜸)
- Git client (안뜸)  
- Generic Webhook Trigger  
- GitLab  
- GitLab API  
- Docker plugin  
- Docker Pipeline  
- SSH
```



---
# webhook 설정

1. GitLab에서 Access Token 발급
	1. ![image-4.png](./image-4.png)
	2. 위와 같이, api, read_user, read_repository에 체크를 한다.
	3. 발급받은 토큰명 : `n_y5xxy225umKpv5YeGF`
2. 저렇게 토큰을 등록했다면, gitlab 레포지토리와 연결이 되었는지 테스트를 한다.
	1. Jenkins관리 -> System -> Gitlab항목으로 이동 -> 아래와 같이 기입한다.
	2. ![image-5.png](./image-5.png)
3. 위와 같이 Success 가 뜬다면 성공. 이제 원격 GitLab레포지토리에 젠킨스가 접근을 할 수 있게 된 것이다. 이제 Pipeline 파일을 작성하여, 어느 레포지토리의 어느 브랜치에서 변화가 일어났을때 빌드를 할 것인지. 그리고 빌드한 결과를 어떤 이름으로 이미지를 만들어서 push, pull을 할 것인지를 상세히 설정을 해두어야 한다.
---
# FreeStyle 프로젝트와 Pipeline 프로젝트의 차이점
- FreeStyle은 GUI기반 단순한 CI/CD 파이프라인 또는 단순한 빌드 작업만을 수행할 수 있다.
- 파이프라인의 구조를 마음대로 바꿀 수 없고, 커스터마이징 또한 할 수 없다.
- Pipeline은 복잡한 CI/CD 파이프라인을 필요로 하거나, 작업 흐름을 코드로 관리하고 버전 컨트롤에서 추적하려는 경우 사용


---

# Jenkins pipline 주요 문법 (미완)
### agent

파이프라인을 실행할 Jenkins 노드를 지정.

- `any`: 사용 가능한 모든 Jenkins 에이전트에서 파이프라인을 실행합니다.
- `none`: 파이프라인 수준에서 에이전트를 할당하지 않습니다.
- `label`: 특정 레이블을 가진 에이전트에서 파이프라인을 실행합니다.
- `docker`: 특정 Docker 이미지를 사용하여 컨테이너에서 파이프라인을 실행합니다.
- `dockerfile`: Dockerfile을 사용하여 컨테이너를 빌드하고 파이프라인을 실행합니다.
- `node`: 특정 노드 이름을 지정하여 파이프라인을 실행합니다.
- `parameters`: 파이프라인 실행 시 매개변수를 사용하여 동적 에이전트 할당을 구현합니다.

  </details>

  <details>
  <summary><h3 style="display: inline; margin-left: 5px;">2025.1.16.</h3></summary>
	## dockerfile이란?
* docker 이미지를 작성할 수 있는 기능
* 이미지는 스크립트를 기반으로 생성되는데, dockerfile은 이 스크립트가 dockerfile문법으로 이루어져 있다.
* 이 dockerfile을 활용하여 나만의 이미지를 만들수 있고, 배포를 위해서 실제로 많이 사용하는 기술이다.

## dockerfile 기본문법
* dockerfile은 텍스트 파일 형식이기 때문에, 각자 사용하는 어떤 에디터로도 작성 할 수 있다.
* dockerfile은 간단히 
```
명령 인수
```
로 되어 있다. 명령은 소문자로 작성해도 괜찮지만, 통상적으로 개발자가 구별하기 쉽게 하기 위해서 대문자로 작성을 한다.

## dockefile 주요명령
 ### FROM
 * 베이스 이미지 지정 명령
 * Dockerfile에서 반드시 있어야 하는 명령어이다.
 * ![](https://images.velog.io/images/tjdwns2243/post/47bd3ae2-6d21-4933-b670-3430849d64ce/image.png)
 * 도커는 계속해서 층으로 여러겹 이미지를 차곡차곡 쌓는 개념이다.
 베이스 이미지란, 그 층 중에서 가장 밑바닥의, 기본이 되는 이미지이고, FROM이 이 이미지를 지정해준다.
 
### LABEL
* LABEL은 <key>=<value> 형식으로 메타 데이터를 넣을 수 있는 기능이다.
* 보통 저자, 버전, 설명, 작성일자 등을 각각 key로 정하고, 그 오른쪽에 설명값을 넣는다.
![](https://images.velog.io/images/tjdwns2243/post/d3adb04c-6d56-4fa6-b017-78611b3fe31a/image.png)
 
 ### CMD 
 * 해당 dockerfile로 만든 이미지를 기반으로 컨테이너를 만들었을 때, 해당 컨테이너가 실행될때 가장 먼저 실행될 프로그램을 기술
 * CMD를 기술하는 방식은 크게 세가지이다.
   * (추천) 명령어, 인자를 리스트처럼 작성하는 형태
  	```
  	예) 
	CMD ["bin/sh", "-c", "echo", "Hello"]
  	-> sh 프로그램에서 명령을 실행하되(bin/sh), 쉘 명령을 터미널 상에서 받지 않고, 인자로 받는다(-c).
  	"echo Hello" 라는 명령어를.
  	-> 만약 이렇게 쓰지 않고 단순히 CMD["echo"]라고 쓸 경우, 쉘에서 echo 명령이 실행되는 것이 아니라, 직접 해당 명령이 실행된다.
  	따라서, 정확하게 쉘(bin/sh)까지 지정을 해서 명령을 실행하는 것이 좋다.
	->반드시 홑따옴표가 아닌, 쌍따옴표를 적어야 한다.
   * ENTRYPOINT 명령어에 인자를 리스트처럼 작성하여 넘겨주는 형태.
  (작성하는 방식은 위와 동일하지만, 실행되는 방식은 상이하다.)
   * 쉘 명령처럼 작성하는 형태
  ```
  CMD <command1> <param1> <param2>...
  ```
 * CMD는 하나의 Dockerfile에서 한 가지만 설정되며, 만약 CMD 설정이 여러개일 경우, 맨 마지막에 설정된 CMD 설정만 적용됨.
 
 ### RUN
 * 도커 명령어의 run(이미지로 컨테이너 만들고 실행할때 쓰는 그거)와 다른 명령어이다.
 * 이 항목의 기능을 알기 위해서는 docker 이미지의 구성방식을 알아야 한다.
   * docker는 이미지를 생성 할 때, 하나의 layer만 쓰는 것이 아니라, 여러 단계의 layer를 층층이 쌓아 작성한다.
   * RUN 명령은 이미지 생성시, 일종의 layer를 만들 수 있는 단계로, 보통 베이스 이미지에 패키지(프로그램)을 추가로 설치하여 새로운 이미지를 만들 때 사용한다.(이렇게 한다면 특정 단계를 변경 할 때, 전체 이미지를 다시 다운로드 받는 번거로움을 해결할 수 있다.)
  예)![](https://images.velog.io/images/tjdwns2243/post/ca3018f7-e6a0-4168-a8ba-c9c65aa470d9/image.png)
  
  ![](https://images.velog.io/images/tjdwns2243/post/64ee3af1-32c6-4e53-9687-36af0022520e/image.png)
 ### ENTRYPOINT
 * 만약 Dockerfile로 이미지를 만든 다음 컨테이너를 docker run으로 생성/ 실행하면서 명령문을 같이 적으며 실행한다면, 기존 이미지에 있던 CMD 명령이 터미널 명령으로 덮어씌워진다.
  하지만, 이미지에 Entrypoint 항목이 있다면, docker run으로 명령을 실행 하더라도 Entrypoint의 명령에 영향을 끼치지 못하고, Entrypoint의 명령 뒤에 쭉 인자로 나열을 하게 된다.
 * 예를 들어, ![](https://images.velog.io/images/tjdwns2243/post/338f4c6a-3d73-478c-b611-e783a7019083/image.png)
  (저는 실수해서 bin/bash라고 적었는데, bin/sh가 맞습니다. alpine에는 bash 안써요 ㅎ;;)
  다음과 같이 Entrypoint에 "bin/bash"가 있는 Dockerfile을 만들었다고 가정하자. 
  이 도커파일로 myweb1이라는 이미지를 생성하자.![](https://images.velog.io/images/tjdwns2243/post/c03ec3aa-3564-4a6a-9bcf-fceb9a269101/image.png)
  생성한 이미지로 httpweb1이라는 컨테이너를 /bin/sh -c http-foreground라는 명령어와 함께 생성한다.
  ![](https://images.velog.io/images/tjdwns2243/post/51592055-9ddf-44bb-b26f-887231cbeb97/image.png)
  docker inspect 명령어로 생성한 컨테이너를 살펴보면
  ![](https://images.velog.io/images/tjdwns2243/post/b9dd5ca4-4dbc-4daf-9c26-f6f35e4cdbbd/image.png)
  ENTRYPOINT의 명령이 그대로 남아있는 것을 볼 수 있다. 
  CMD가 ENTRYPOINT의 뒤에 인자처럼 붙게 되므로, 다음 컨테이너는
  1. /bin/bash 
  2. /bin/sh
  3. -c 
  4. httpd-foreground
  의 순서대로 실행이 될 것이다.
 ### EXPOSE
 * docker 컨테이너의 특정 포트를 외부에 오픈하는 설정.
 * docker run -p옵션과 유사하다. 차이점은, -p옵션은 컨테이너의 특정 포트를 외부에 오픈하고, 해당 포트를 호스트 PC의 특정 포트와 매핑시키는 것까지 알아서 해주지만, EXPOSE는 걍 단순히 포트를 열어주기만 한다는 것이다.
  결국, 도커파일에 EXPOSE로 포트를 열어주었더라도, docker run을 할 때, p옵션을 쓰긴 쓰게 된다.
```
docker run -P -d myweb
```
↑과 같이, -p를 대문자로 써준다면, EXPOSE로 열어준 포트로 호스트 PC의 랜덤 포트가 매핑된다.(따라서, 할때만다 달라진다.) 
 ### ENV 
 * 컨테이너 내의 환경변수 설정
 * 설정한 환경변수는 RUN, CMD, ENTRYPOINT 명령에도 적용된다.
```
ENV MYSQL_ROOT_PASSWORD=password # mysql 슈퍼관리자인 root ID에 대한 password란에 패스워드 설정하기
ENV MYSQL_DATABASE=dbname # DB 지정해주기
ENV MYSQL_USER=user
ENV MYSQL_PASSWORD=pw #mysql 추가 사용자 ID, 패스워드 설정
```
  더 구체적인 설정사항은 관련 이미지의 도커 허브 사용 설명서를 참고하자.
  
 ### WORKDIR
  * 이미지 내에서 특정 폴더로 이동하기 위해서 쓰는 명령
    * RUN, CMD, ENTRYPOINT 명령이 실행될 디렉토리 설정
  예)![](https://images.velog.io/images/tjdwns2243/post/2d021d02-1bdc-4dd2-a515-6e4eaff14e20/image.png)

## 작성한 dockerfile로 이미지 만들기
```
docker build --tag <짓고싶은 이미지명> .
docker build --tag <짓고싶은 이미지명> -f <Dockerfile명> .
```
둘다 Dockerfile이 있는 폴더내에서 이미지를 빌드한다는 조건이다.
단, Dockerfile명이 그냥 Dockerfile이라면 -f 옵션이 없어도 되지만, 그 이외의 이름일 경우에는 -f 옵션으로 파일명을 명시해 줄 수 있다.
  
## 그 이외의 명령
  ### docker logs
```
docker logs <컨테이너 ID 혹은 이름>
```
  log란? http 아파치 웹서버에서 접속기록이나 요청기록을 기록해 놓기 위해서 특정 log라는 파일에 저장해 놓는 기록.
  ### docker kill
  ```
  docker kill <컨테이너ID 또는 이름>
  ```
  docker stop은 즉시 컨테이너를 중단하지 않고, 현재 실행중인 단계까지는 기다린 후에 중지를 하지만, docker kill은 즉시 컨테이너를 중지한다.
  -> 따라서 조금 더 빨리 중단을 할 수 있다.
  ### docker insepct
  ```
  docker inspect <이미지명>
  ```
  Lables, Cmd, entrytable과 같은 이미지 설정을 확인해 볼 수 있다.
  
  </details>