export type SignupPayload = { email: string; password: string };

export async function signup(payload: SignupPayload) {
  const res = await fetch("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const json = await res.json();
  if (!res.ok || !json?.success) {
    throw new Error(json?.error?.message ?? "회원가입에 실패했습니다. 이미 가입된 회원입니다.");
  }
  return json.data;
}

export async function withdraw() {
  const res = await fetch('/api/auth/withdraw', {
    method: 'DELETE', 
    headers:{'Content-Type': 'application/json'}
  })

  if (!res.ok) {
    let message = "회원탈퇴 실패"
    try {
      const data = await res.json();
      if (data?.message) message = data.message;
    } catch {
      // ignore
    }
    throw new Error(message);
  }

  return true;
}