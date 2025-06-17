//test
import React, { useState } from "react";
import styles from "../styles/SignUp.module.css";
import personImg from "../assets/images/person.png";
import lockImg from "../assets/images/lock.png";
import eyeonImg from "../assets/images/eyeon.png";
import eyeoffImg from "../assets/images/eyeoff.png";
import mailImg from "../assets/images/mail.png";
import { useNavigate } from "react-router-dom";


function SignUp() {
  const [form, setForm] = useState({ name: "", password: "", email: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [nameError, setNameError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === "password") {
      if (value.length < 8 || value.length >= 50) {
        setPasswordError("비밀번호는 8자 이상 50자 미만이어야 합니다");
      } else {
        setPasswordError("");
      }
    }

    if (name === "email") {
      setEmailError("");
    }

    if (name === "name") {
      setNameError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password.length < 8 || form.password.length >= 50) {
      setPasswordError("비밀번호는 8자 이상 50자 미만이어야 합니다");
      return;
    }

    try {
      const emailCheckResponse = await fetch(`http://3.38.185.232:8080/api/members/signup`);
      const emailCheckData = await emailCheckResponse.json();

      if (emailCheckData.isDuplicate) {
        setEmailError("이미 사용 중인 이메일입니다.");
        return;
      }
    } catch (error) {
      console.error("이메일 중복 확인 중 오류 발생:", error);
    }

    try {
      const response = await fetch("http://3.38.185.232:8080/api/members/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          passwd: form.password,
        }),
      });

      const data = await response.json();

      if (data.error === "이름은 필수 입력 값입니다.") {
        setNameError("이름은 필수 입력 값입니다.");
        return;
      }

      if (data.code === 4000) {
        setPasswordError("비밀번호는 8자리 이상 50자리 미만으로 입력해주세요");
        return;
      }

      if (data.code === 1001) {
        setEmailError("이미 사용 중인 이메일입니다.");
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || "회원가입 실패");
      }

      setNameError("");
      setEmailError("");
      setPasswordError("");

      alert("회원가입 완료!");
      navigate("/login");
    } catch (error) {
      console.error("회원가입 요청 중 오류 발생:", error);
      setPasswordError(error.message || "회원가입 중 오류가 발생했습니다.");
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

      <button className={styles.signupButton} type="submit">
        회원가입
      </button>

      {/* ✅ 에러 메시지 묶어서 버튼 아래로 이동 */}
      <div className={styles.errorGroup}>
        {nameError && <div className={styles.errorMessage}>{nameError}</div>}
        {emailError && <div className={styles.errorMessage}>{emailError}</div>}
        {passwordError && (
          <div className={styles.errorMessage}>{passwordError}</div>
        )}
      </div>

      <div className={styles.loginPrompt}>
        이미 회원이신가요?
        <span onClick={goToLogin}>로그인</span>
      </div>
    </form>
  );
}

export default SignUp;