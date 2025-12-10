'use server'

export async function signup(prevState : unknown, formData : FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    let error = {
        email : '',
        password : ''
    }

    if (!email.includes("@")) {
        error.email = '이메일이 올바르지 않습니다.'
    }

    if (password.length < 8) {
        error.password = '비밀번호는 8자 이상이어야 합니다.'
    }

    if (Object.keys(error).length > 0) {
        return {
            errors : error
        }
    }

    //db에 저장
}