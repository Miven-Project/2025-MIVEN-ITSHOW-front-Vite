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

  const apiBaseUrl = "https://leafin.mirim-it-show.site";

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log("🚀 로그인 요청 시작");
      console.log("📤 요청 데이터:", {
        email: form.email,
        passwd: form.password,
      });

      const response = await fetch(`${apiBaseUrl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          passwd: form.password,
        }),
      });

      console.log("📊 응답 상태:", response.status);
      console.log("📊 응답 상태 텍스트:", response.statusText);
      console.log("📊 응답 헤더:", response.headers);

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error("❌ 로그인 실패 응답:", errorData);
        throw new Error(errorData?.message || "로그인에 실패했습니다.");
      }

      // 🔥 서버 응답 전체를 자세히 확인
      const text = await response.text();
      console.log("📥 서버 응답 원본 텍스트:", text);

      if (!text || text.trim() === "") {
        throw new Error("서버에서 빈 응답을 받았습니다.");
      }

      const data = JSON.parse(text);
      console.log("📥 서버 응답 전체:", data);
      console.log("📥 응답 구조 분석:");
      console.log("- data.code:", data.code);
      console.log("- data.message:", data.message);
      console.log("- data.data:", data.data);

      if (data.data) {
        console.log("- data.data.token:", data.data.token);
        console.log("- data.data의 모든 키:", Object.keys(data.data));
      }

      // 🔥 다양한 가능한 토큰 위치들을 확인
      const possibleTokens = [
        data.token, // 최상위에 있는 경우
        data.data?.token, // data 안에 있는 경우
        data.data?.accessToken, // accessToken으로 되어 있는 경우
        data.data?.authToken, // authToken으로 되어 있는 경우
        data.data?.jwt, // jwt로 되어 있는 경우
        data.accessToken, // 최상위에 accessToken인 경우
        data.authToken, // 최상위에 authToken인 경우
      ];

      console.log("🔍 가능한 토큰들:", possibleTokens);

      let finalToken = null;

      // 첫 번째로 유효한 토큰 찾기
      for (const token of possibleTokens) {
        if (token && typeof token === "string" && token.trim() !== "") {
          finalToken = token;
          console.log("✅ 토큰 발견:", finalToken.substring(0, 20) + "...");
          break;
        }
      }

      if (!finalToken) {
        console.error("❌ 토큰을 찾을 수 없습니다!");
        console.log("💡 전체 응답에서 'token'이라는 단어 검색:");
        const responseStr = JSON.stringify(data, null, 2);
        const tokenMatches = responseStr.match(/token/gi);
        console.log("- 'token' 발견 횟수:", tokenMatches?.length || 0);

        throw new Error(
          "서버에서 토큰을 받지 못했습니다. 응답을 확인해주세요."
        );
      }

      // 🔥 토큰 저장 (Bearer 접두사 처리)
      const tokenToSave = finalToken.startsWith("Bearer ")
        ? finalToken
        : finalToken; // Bearer 접두사는 getAuthToken에서 추가하므로 여기서는 원본 그대로 저장

      localStorage.setItem("authToken", tokenToSave);
      console.log("💾 토큰 저장 완료");
      console.log("💾 저장된 토큰 확인:", localStorage.getItem("authToken"));

      // 🔥 성공 조건 확인 (더 유연하게)
      const isSuccess =
        data.code === 200 ||
        data.status === "success" ||
        response.status === 200;

      if (isSuccess && finalToken) {
        alert("로그인 완료!");
        navigate("/home"); // MyPage로 이동
      } else {
        console.warn("⚠️ 성공 조건을 만족하지 않음:");
        console.log("- data.code:", data.code);
        console.log("- response.status:", response.status);
        throw new Error("로그인 응답이 예상과 다릅니다.");
      }
    } catch (error) {
      console.error("🚨 로그인 오류:", error);
      alert(`로그인 실패: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const goToSignUp = () => {
    navigate("/signup");
  };

  return (
    <div>
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
    </div>
  );
}

export default Login;
