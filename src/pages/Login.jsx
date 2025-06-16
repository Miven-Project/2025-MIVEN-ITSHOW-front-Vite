import React, { useState } from "react";
import styles from "../styles/Login.module.css";
import personImg from "../assets/images/person.png";
import lockImg from "../assets/images/lock.png";
import eyeonImg from "../assets/images/eyeon.png";
import eyeoffImg from "../assets/images/eyeoff.png";
import { useNavigate } from "react-router-dom";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" }); // username → email
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://3.38.185.232:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          passwd: form.password,
        }),
      });

      if (!response.ok) {
        throw new Error("로그인 실패");
      }

      const data = await response.json();
      console.log("로그인 성공", data);

      // 예: 토큰 저장 - 이 부분을 제거했습니다.
      // localStorage.setItem("token", data.token); // <--- 이 줄을 제거했습니다.

      alert("로그인 완료!");
      navigate("/Home"); // 로그인 성공 후 이동할 페이지 경로
    } catch (error) {
      alert(error.message);
    }
  };

  const goToSignUp = () => {
    navigate("/signup");
  };

  return (
    <form className={styles.signupContainer} onSubmit={handleSubmit}>
      <h2 className={styles.title}>로그인</h2>

      <div className={styles.inputGroupBox}>
        <div className={styles.inputLine}>
          <img src={personImg} alt="이메일" />
          <input
            type="email"
            name="email"
            placeholder="이메일"
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
        로그인
      </button>

      <div className={styles.loginPrompt}>
        아직 회원이 아니신가요?
        <span onClick={goToSignUp}>회원가입</span>
      </div>
    </form>
  );
}

export default Login;