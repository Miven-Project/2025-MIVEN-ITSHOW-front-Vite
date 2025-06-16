import React, { useState } from "react";
import styles from "../styles/Login.module.css";
import personImg from "../assets/images/person.png";
import lockImg from "../assets/images/lock.png";
import eyeonImg from "../assets/images/eyeon.png";
import eyeoffImg from "../assets/images/eyeoff.png";
import { useNavigate } from "react-router-dom";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

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
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "로그인에 실패했습니다.");
      }

      const data = await response.json();
      console.log("로그인 성공", data);

      // 🔥 토큰 저장 (authToken으로 키 이름 통일)
      if (data.code === 200 && data.data?.token) {
        localStorage.setItem("authToken", data.data.token);
        console.log("토큰 저장 완료:", data.data.token);

        alert("로그인 완료!");
        navigate("/Home"); // MyPage로 이동 (또는 원하는 페이지)
      } else {
        throw new Error("서버에서 토큰을 받지 못했습니다.");
      }
    } catch (error) {
      console.error("로그인 오류:", error);
      alert(error.message);
    } finally {
      setIsLoading(false);
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
            disabled={isLoading}
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
            disabled={isLoading}
          />
          <img
            src={showPassword ? eyeoffImg : eyeonImg}
            alt="비밀번호 보기"
            className={styles.eyeToggle}
            onClick={() => setShowPassword(!showPassword)}
          />
        </div>
      </div>

      <button
        className={styles.signupButton}
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? "로그인 중..." : "로그인"}
      </button>

      <div className={styles.loginPrompt}>
        아직 회원이 아니신가요?
        <span onClick={goToSignUp}>회원가입</span>
      </div>
    </form>
  );
}

export default Login;
