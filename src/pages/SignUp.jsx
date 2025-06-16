import React, { useState } from "react";
import styles from "../styles/SignUp.module.css";
import personImg from "../assets/images/person.png";
import lockImg from "../assets/images/lock.png";
import eyeonImg from "../assets/images/eyeon.png";
import eyeoffImg from "../assets/images/eyeoff.png"; // assets/eyeoff.png -> assets/images/eyeoff.png로 수정 필요할 수 있음
import mailImg from "../assets/images/mail.png";
import { useNavigate } from "react-router-dom";

function SignUp() {
  const [form, setForm] = useState({ name: "", password: "", email: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [nameError, setNameError] = useState(""); // 💡 setNameError를 위한 상태 정의

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // 이름 입력 시 이름 오류 메시지 초기화
    if (name === "name") {
      setNameError("");
    }
    // 비밀번호 유효성 검사
    if (name === "password") {
      if (value.length < 8 || value.length >= 50) {
        setPasswordError("비밀번호는 8자 이상 50자 미만이어야 합니다");
      } else {
        setPasswordError("");
      }
    }
    // 이메일 입력 시 이메일 오류 메시지 초기화
    if (name === "email") {
      setEmailError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // 기본 폼 제출 동작 방지

    // 클라이언트 측 이름 유효성 검사
    if (!form.name.trim()) { // 이름이 비어있거나 공백만 있는 경우
      setNameError("이름은 필수 입력 값입니다.");
      return; // 이름 오류가 있으면 더 이상 진행하지 않음
    }

    // 비밀번호 길이 조건 검사
    if (form.password.length < 8 || form.password.length >= 50) {
      setPasswordError("비밀번호는 8자 이상 50자 미만이어야 합니다");
      return; // 비밀번호 오류가 있으면 더 이상 진행하지 않음
    }

    // --- 이메일 중복 확인 요청 (가장 중요!) ---
    // 백엔드의 이메일 중복 확인 API 주소로 수정해야 합니다.
    // 현재 코드의 `http://3.38.185.232:8080/api/members/signup`는 회원가입 API이며,
    // 보통 GET 요청으로 이메일을 보내 중복을 확인하지 않습니다.
    // 백엔드 개발자에게 정확한 이메일 중복 확인 API 주소를 문의하거나
    // 개발자 도구의 Network 탭에서 확인해야 합니다.
    // 여기서는 `check-email`이라는 가상의 GET API를 사용합니다.
    try {
      const emailCheckResponse = await fetch(`http://3.38.185.232:8080/api/members/check-email?email=${form.email}`); // 💡 이메일 중복 확인 API 주소 수정!
      
      // 응답이 성공적인지 확인 (HTTP 상태 코드 2xx)
      if (!emailCheckResponse.ok) {
        // 서버에서 200 OK가 아닌 다른 상태 코드를 보낼 경우 (예: 409 Conflict)
        const errorData = await emailCheckResponse.json();
        if (errorData.message === "Email already exists") { // 백엔드 메시지에 따라 수정
            setEmailError("이미 사용 중인 이메일입니다.");
            return;
        }
        throw new Error(errorData.message || "이메일 중복 확인 중 알 수 없는 오류 발생");
      }

      const emailCheckData = await emailCheckResponse.json();

      // 💡 백엔드 응답 형식에 맞춰 isDuplicate 필드 확인 (매우 중요!)
      // 백엔드가 `{"isDuplicate": true}`와 같이 응답할 경우
      if (emailCheckData.isDuplicate) { 
        setEmailError("이미 사용 중인 이메일입니다.");
        return; // 중복이면 회원가입 진행하지 않음
      }
      // 백엔드가 `{"status": "DUPLICATE"}` 와 같이 응답할 경우:
      // if (emailCheckData.status === "DUPLICATE") { ... }
      // 백엔드가 `{"available": false}` 와 같이 응답할 경우:
      // if (emailCheckData.available === false) { ... }

    } catch (error) {
      console.error("이메일 중복 확인 중 네트워크 또는 서버 오류:", error);
      // 사용자에게 네트워크 오류임을 알리거나, 회원가입 진행을 막을 수 있습니다.
      setEmailError("이메일 중복 확인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      return; 
    }

    // --- 최종 회원가입 요청 ---
    try {
      const response = await fetch("http://3.38.185.232:8080/api/members/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          passwd: form.password, // 백엔드에서 `passwd`로 받는지 `password`로 받는지 확인 필요
        }),
      });
      const data = await response.json();

      // 서버에서 반환하는 오류 코드 및 메시지에 따라 처리
      // 💡 이 부분은 백엔드 API 명세와 정확히 일치해야 합니다.
      if (!response.ok) { // HTTP 상태 코드가 200번대가 아닌 경우 (4xx, 5xx 에러)
        // 백엔드에서 특정 에러 메시지나 코드를 줄 경우
        if (data.error === "이름은 필수 입력 값입니다.") {
          setNameError(data.error);
          return;
        }
        if (data.code === 4000) { // 예시: 비밀번호 길이 오류
          setPasswordError("비밀번호는 8자리 이상 50자리 미만으로 입력해주세요");
          return;
        }
        if (data.code === 1001) { // 예시: 이메일 중복 오류 (클라이언트 중복확인 통과 후 서버에서 최종 검출 시)
          setEmailError("이미 사용 중인 이메일입니다.");
          return;
        }
        // 그 외 서버 에러 메시지
        throw new Error(data.message || "회원가입 실패 (서버 응답 오류)");
      }

      // 서버 응답이 성공적일 경우 (response.ok가 true)
      alert("회원가입 완료!");
      navigate("/login"); // 로그인 페이지로 이동
      
    } catch (error) {
      // fetch 자체에서 발생한 네트워크 오류 (예: 서버 연결 불가)
      console.error("회원가입 요청 중 네트워크 또는 예상치 못한 오류 발생:", error);
      // 사용자에게 일반적인 오류 메시지 표시
      alert("회원가입 중 오류가 발생했습니다: " + error.message);
      // 필요하다면 특정 에러 상태를 설정 (예: setGeneralError("네트워크 오류 발생");)
    }
  };

  const goToLogin = () => {
    navigate("/login");
  };

  return (
    <form className={styles.signupContainer} onSubmit={handleSubmit}>
      <h2 className={styles.title}>회원가입</h2>

      <div className={styles.inputGroupBox}>
        <div className={styles.inputLine}>
          <img src={personImg} alt="이름" />
          <input
            type="text"
            name="name"
            placeholder="이름"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>
        {/* 💡 이름 오류 메시지 표시 */}
        {nameError && (
          <div className={styles.errorMessage}>{nameError}</div>
        )}

        <div className={styles.inputLine}>
          <img src={mailImg} alt="이메일" />
          <input
            type="email"
            name="email"
            placeholder="이메일주소"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* 💡 이메일 오류 메시지 표시 */}
        {emailError && (
          <div className={styles.errorMessage}>{emailError}</div>
        )}

        <div className={styles.inputLine}>
          <img src={lockImg} alt="비밀번호" />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="비밀번호"
            value={form.password}
            onChange={handleChange}
            required
          />
          <img
            src={showPassword ? eyeoffImg : eyeonImg}
            alt="비밀번호 보기"
            className={styles.eyeToggle}
            onClick={() => setShowPassword(!showPassword)}
          />
        </div>
      </div>

      {passwordError && (
        <div className={styles.errorMessage}>{passwordError}</div>
      )}

      <button className={styles.signupButton} type="submit">
        회원가입
      </button>

      <div className={styles.loginPrompt}>
        이미 회원이신가요?
        <span onClick={goToLogin}>로그인</span>
      </div>
    </form>
  );
}

export default SignUp;