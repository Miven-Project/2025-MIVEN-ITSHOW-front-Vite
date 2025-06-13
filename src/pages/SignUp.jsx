import React, { useState } from "react";
import styles from "../styles/SignUp.module.css";
import personImg from "../assets/images/person.png";
import lockImg from "../assets/images/lock.png";
import eyeonImg from "../assets/images/eyeon.png";
import eyeoffImg from "../assets/images/eyeoff.png";
import mailImg from "../assets/images/mail.png";

function SignUp() {
  const [form, setForm] = useState({ username: "", password: "", email: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("회원가입 완료!");
  };

  return (
    <form className={styles.signupContainer} onSubmit={handleSubmit}>
      <h2 className={styles.title}>회원가입</h2>

      <div className={styles.inputGroupBox}>
        <div className={styles.inputLine}>
          <img src={personImg} alt="아이디" />
          <input
            type="text"
            name="username"
            placeholder="아이디"
            value={form.username}
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
      </div>

      <button className={styles.signupButton} type="submit">
        회원가입
      </button>
    </form>
  );
}

export default SignUp;
