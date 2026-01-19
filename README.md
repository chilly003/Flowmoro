# 🌟 Flowmoro

**하루 루틴 구성 + 뽀모도로 집중 타이머를 결합한 생산성 도구**

🔗 **배포 주소**: [https://flowmoro-sigma.vercel.app/](https://flowmoro-sigma.vercel.app/)

Next.js 기반 개인 루틴 관리 도구로,
일정을 구성하고 각 태스크를 뽀모도로 방식으로 실행할 수 있습니다.

---

## ✨ 주요 기능

### 🔐 NextAuth 로그인

* NextAuth(Auth.js) 기반 인증

### 🗂️ 루틴 계획 (Day)

* 하루 단위 일정 구성
* 태스크 생성·삭제.수정 지원

### ⏱️ 뽀모도로 타이머

* 시작 / 종료
* 집중 시간 설정(15, 30, 60, 자유선택)
* 완료된 집중 시간은 태스크에 누적 기록
* 집중도를 높일 수 있게 React Bits를 사용한 디자인 추가

### 📘 이후 추가 사항

* `/guide`에서 사용 방법 제공
* 집중 시간 끝나면 알림 소리 혹은 화면 제공
* 주단위 확인 가능하게 수정
* 각 집중 시간별 시각화 그래프 추가

---

## 🛠️ 기술 스택

| 영역        | 기술                      |
| --------- | ----------------------- |
| Framework | Next.js (App Router)    |
| Language  | TypeScript              |
| UI        | Tailwind CSS, shadcn/ui |
| State     | Zustand                 |
| Auth      | NextAuth                |
| DB        | MySQL (Aiven Free)      |
| Deploy    | Vercel                  |

---
