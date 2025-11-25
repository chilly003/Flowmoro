# 🌟 Flowmoro

**하루/주간 루틴 구성 + 뽀모도로 집중 타이머를 결합한 생산성 도구**

Next.js 기반 개인 루틴 관리 도구로,
일정을 구성하고 각 태스크를 뽀모도로 방식으로 실행할 수 있습니다.

---

## ✨ 주요 기능

### 🔐 Google 로그인

* Google OAuth 기반 간편 로그인
* NextAuth(Auth.js) 기반 인증

### 🗂️ 루틴 계획 (Day / Week)

* 하루 단위 / 주간 단위 일정 구성
* Drag & Drop 기반 태스크 정렬
* 예상 집중 시간 설정
* 태스크 생성·수정·삭제 지원

### ⏱️ 뽀모도로 타이머

* 시작 / 일시정지 / 재개 / 종료
* 집중/휴식 시간 설정
* 타이머 종료 시 알림 사운드 재생
* 완료된 집중 시간은 태스크에 누적 기록

### 📘 활용 안내 페이지

* `/guide`에서 사용 방법 제공
* 루틴 작성 방법 및 뽀모도로 기초 정리
* SEO 친화적 콘텐츠 페이지 구성(SSR/SSG)

---

## 🛠️ 기술 스택

| 영역        | 기술                      |
| --------- | ----------------------- |
| Framework | Next.js (App Router)    |
| Language  | TypeScript              |
| UI        | Tailwind CSS, shadcn/ui |
| State     | Zustand                 |
| Auth      | NextAuth + Google OAuth |
| DB        | MySQL + Prisma          |
| Deploy    | Vercel                  |

---