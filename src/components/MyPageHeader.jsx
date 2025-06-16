import React, { useState, useRef, useEffect } from "react";
import Nav from "../components/Nav";
import styles from "../styles/MyPageHeader.module.css";
import { FiSettings, FiCamera } from "react-icons/fi";
import { FaPlay, FaPause } from "react-icons/fa";
import { useCoverColor } from "../contexts/CoverColorContext";
import { HexColorPicker } from "react-colorful";
import mypageHeaderData from "../data/mypageheaderData.json";
import "../global.css";

export default function MyPageHeader() {
  const [data, setData] = useState({
    ...mypageHeaderData,
    quote: {
      title: "인상 깊은 책이나 구절을 입력해주세요",
      text: "당신만의 특별한 문구를 여기에 남겨보세요",
    },
  });
  const [isEditing, setIsEditing] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [editedUsername, setEditedUsername] = useState(
    mypageHeaderData.user.username
  );
  const [editedQuoteTitle, setEditedQuoteTitle] = useState(
    "인상 깊은 책이나 구절을 입력해주세요"
  );
  const [editedQuoteText, setEditedQuoteText] = useState(
    "당신만의 특별한 문구를 여기에 남겨보세요"
  );
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#15719E");
  const [showCustomColorInput, setShowCustomColorInput] = useState(false);
  const [customColor, setCustomColor] = useState("#15719E");
  const [searchQuery, setSearchQuery] = useState("");
  const [userName, setUserName] = useState("");
  const [quoteCount, setQuoteCount] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isMusicDataLoading, setIsMusicDataLoading] = useState(true);

  // 백엔드 연결용 상태 추가
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // 음악 관련 state
  const [musicData, setMusicData] = useState({
    id: null,
    song: "음악을 검색해보세요",
    artist: "아티스트",
    album: "",
    image: null,
    preview: null,
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [showMusicSearch, setShowMusicSearch] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isMusicLoading, setIsMusicLoading] = useState(false);
  const [error, setError] = useState(null);
  const [previewPlayingIndex, setPreviewPlayingIndex] = useState(null);

  const audioRef = useRef(null);
  const previewAudioRef = useRef(null);
  const songNameRef = useRef(null);
  const artistRef = useRef(null);
  const { setCoverColor } = useCoverColor();

  // API 설정
  const apiBaseUrl = "http://3.38.185.232:8080";

  // 🔥 동적 토큰 가져오기 함수
  const getAuthToken = () => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      throw new Error("로그인이 필요합니다. 토큰이 없습니다.");
    }

    // Bearer 접두사가 없으면 추가
    return token.startsWith("Bearer ") ? token : `Bearer ${token}`;
  };

  const uploadProfileImage = async (imageFile) => {
    try {
      setIsUploadingImage(true);

      const formData = new FormData();
      formData.append("file", imageFile);

      // 🔥 동적으로 토큰 가져오기
      const token = getAuthToken();

      const response = await fetch(`${apiBaseUrl}/api/profile`, {
        method: "POST",
        headers: {
          Authorization: token,
        },
        body: formData,
      });

      if (response.status === 403) {
        localStorage.removeItem("authToken");
        throw new Error("인증이 만료되었습니다. 다시 로그인해주세요.");
      }

      if (response.status === 401) {
        localStorage.removeItem("authToken");
        throw new Error("인증에 실패했습니다. 다시 로그인해주세요.");
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }

      const result = await response.json();
      console.log("이미지 업로드 응답 전체:", result);

      const imageUrl = result.data?.url || result.url;
      console.log("최종 이미지 URL:", imageUrl);

      return imageUrl;
    } catch (error) {
      console.error("이미지 업로드 실패:", error);

      // 토큰 관련 에러인 경우 로그인 페이지로 리다이렉트
      if (error.message.includes("로그인") || error.message.includes("인증")) {
        // window.location.href = '/login';
      }

      throw error;
    } finally {
      setIsUploadingImage(false);
    }
  };

  // 프로필 업데이트 함수
  const updateProfile = async (profileData) => {
    try {
      setIsSaving(true);
      setSaveError(null);

      // 🔥 동적으로 토큰 가져오기
      const token = getAuthToken();

      const response = await fetch(`${apiBaseUrl}/api/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(profileData),
      });

      if (response.status === 403) {
        localStorage.removeItem("authToken");
        throw new Error("인증이 만료되었습니다. 다시 로그인해주세요.");
      }

      if (response.status === 401) {
        localStorage.removeItem("authToken");
        throw new Error("인증에 실패했습니다. 다시 로그인해주세요.");
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }

      const result = await response.json();
      console.log("프로필 업데이트 성공:", result);
      return result;
    } catch (error) {
      console.error("프로필 업데이트 실패:", error);
      setSaveError(error.message);

      // 토큰 관련 에러인 경우 로그인 페이지로 리다이렉트
      if (error.message.includes("로그인") || error.message.includes("인증")) {
        // window.location.href = '/login';
      }

      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  // 텍스트 오버플로우 체크 및 애니메이션 적용
  useEffect(() => {
    const checkTextOverflow = (element, text) => {
      if (element?.current) {
        const elementWidth = element.current.offsetWidth;
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        const fontSize = element === songNameRef ? "16px" : "13px";
        const fontFamily =
          element === songNameRef ? "Pretendard" : "PretendardL";
        context.font = `${fontSize} ${fontFamily}`;
        const textWidth = context.measureText(text).width;

        if (textWidth > elementWidth) {
          element.current.classList.add(styles.overflow);
        } else {
          element.current.classList.remove(styles.overflow);
        }
      }
    };

    checkTextOverflow(songNameRef, musicData.song);
    checkTextOverflow(artistRef, musicData.artist);
  }, [musicData.song, musicData.artist]);

  // Deezer API 검색
  const searchMusic = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsMusicLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://deezerdevs-deezer.p.rapidapi.com/search?q=${encodeURIComponent(
          query
        )}`,
        {
          method: "GET",
          headers: {
            "x-rapidapi-key":
              "7138ae1e3cmsh63d4fa598445c5dp183b4ajsn1c9c5bdd5a48",
            "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
          },
        }
      );
      const result = await response.json();
      setSearchResults(result.data?.slice(0, 20) || []);
    } catch (err) {
      setError("음악 검색 중 오류가 발생했습니다.");
      setSearchResults([]);
    } finally {
      setIsMusicLoading(false);
    }
  };

  // 검색어 디바운스
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery && showMusicSearch) {
        searchMusic(searchQuery);
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, showMusicSearch]);

  // 모달 미리듣기
  const togglePreviewMusic = (musicIndex, previewUrl) => {
    if (!previewUrl) {
      alert("이 곡은 미리듣기가 제공되지 않습니다.");
      return;
    }

    // 메인 플레이어 정지
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    }

    // 다른 미리듣기 정지
    if (previewPlayingIndex !== null && previewPlayingIndex !== musicIndex) {
      previewAudioRef.current?.pause();
    }

    // 현재 곡 토글
    if (previewPlayingIndex === musicIndex) {
      previewAudioRef.current?.pause();
      setPreviewPlayingIndex(null);
    } else {
      if (previewAudioRef.current) {
        previewAudioRef.current.src = previewUrl;
        previewAudioRef.current
          .play()
          .catch(() => alert("미리듣기 재생 중 오류가 발생했습니다."));
        setPreviewPlayingIndex(musicIndex);
      }
    }
  };

  // 음악 선택 (musicId 저장 추가)
  const selectMusic = (selectedMusic) => {
    setMusicData({
      id: selectedMusic.id,
      song: selectedMusic.title,
      artist: selectedMusic.artist.name,
      album: selectedMusic.album.title,
      image: selectedMusic.album.cover_medium || selectedMusic.album.cover,
      preview: selectedMusic.preview,
    });
    setShowMusicSearch(false);
    setSearchQuery("");

    // 미리듣기 정지
    previewAudioRef.current?.pause();
    setPreviewPlayingIndex(null);

    // 메인 플레이어 정지
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    }
  };

  // 메인 플레이어 토글
  const togglePlayMusic = () => {
    if (!musicData.preview) {
      alert("이 곡은 미리듣기가 제공되지 않습니다.");
      return;
    }

    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        ?.play()
        .catch(() => alert("음악 재생 중 오류가 발생했습니다."));
      setIsPlaying(true);
    }
  };

  // 오디오 이벤트
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const handleEnded = () => setIsPlaying(false);
      audio.addEventListener("ended", handleEnded);
      return () => audio.removeEventListener("ended", handleEnded);
    }
  }, [musicData.preview]);

  useEffect(() => {
    const audio = previewAudioRef.current;
    if (audio) {
      const handleEnded = () => setPreviewPlayingIndex(null);
      audio.addEventListener("ended", handleEnded);
      return () => audio.removeEventListener("ended", handleEnded);
    }
  }, []);

  // 🔥 프로필 정보 가져오기 (동적 토큰 사용)
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsImageLoading(true);
        setIsMusicDataLoading(true);

        // 🔥 동적으로 토큰 가져오기
        const token = getAuthToken();

        const response = await fetch(`${apiBaseUrl}/api/profile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        });

        // ✅ 403 에러 체크
        if (response.status === 403) {
          console.log("🔒 인증 만료 - 로그인이 필요합니다");
          localStorage.removeItem("authToken");
          setSaveError("인증이 만료되었습니다. 다시 로그인해주세요.");
          setIsImageLoading(false);
          setIsMusicDataLoading(false);
          return;
        }

        // ✅ 401 에러 체크
        if (response.status === 401) {
          console.log("🔒 인증 실패 - 로그인이 필요합니다");
          localStorage.removeItem("authToken");
          setSaveError("인증에 실패했습니다. 다시 로그인해주세요.");
          setIsImageLoading(false);
          setIsMusicDataLoading(false);
          return;
        }

        // ✅ 다른 에러 체크
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // ✅ 빈 응답 체크
        const text = await response.text();
        if (!text || text.trim() === "") {
          console.log("📭 서버에서 빈 응답을 받았습니다");
          setIsImageLoading(false);
          setIsMusicDataLoading(false);
          return;
        }

        // ✅ JSON 파싱
        const responseData = JSON.parse(text);
        console.log("✅ 프로필 데이터 로드 성공:", responseData);

        // 데이터 구조 확인
        const profileData = responseData.data;
        if (!profileData) {
          console.warn("⚠️ profileData가 없습니다:", responseData);
          setIsImageLoading(false);
          setIsMusicDataLoading(false);
          return;
        }

        // 기본 정보 즉시 설정 (텍스트 정보)
        setUserName(profileData.name || "");
        setQuoteCount(profileData.quoteCount || 0);

        // 커버 색상 즉시 설정
        if (profileData.coverColor) {
          const colorWithHash = profileData.coverColor.startsWith("#")
            ? profileData.coverColor
            : `#${profileData.coverColor}`;
          setSelectedColor(colorWithHash);
          setCoverColor(colorWithHash);
        }

        // 인용구 정보 즉시 설정
        if (profileData.quote) {
          setData((prev) => ({
            ...prev,
            quote: {
              title: profileData.quote.title,
              text: profileData.quote.text,
            },
          }));
          setEditedQuoteTitle(profileData.quote.title);
          setEditedQuoteText(profileData.quote.text);
        }

        // 편집용 이름 즉시 업데이트
        setEditedUsername(profileData.name || mypageHeaderData.user.username);

        // 이미지 로딩 (별도 처리)
        if (profileData.profileImg) {
          const img = new Image();
          img.onload = () => {
            setSelectedImage(profileData.profileImg);
            setIsImageLoading(false);
          };
          img.onerror = () => {
            setIsImageLoading(false);
          };
          img.src = profileData.profileImg;
        } else {
          setIsImageLoading(false);
        }

        // 음악 정보 로딩 (별도 처리)
        if (profileData.music) {
          try {
            const musicResponse = await fetch(
              `https://deezerdevs-deezer.p.rapidapi.com/search?q=${encodeURIComponent(
                `${profileData.music.song} ${profileData.music.artist}`
              )}`,
              {
                method: "GET",
                headers: {
                  "x-rapidapi-key":
                    "7138ae1e3cmsh63d4fa598445c5dp183b4ajsn1c9c5bdd5a48",
                  "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
                },
              }
            );
            const musicResult = await musicResponse.json();

            if (musicResult.data?.[0]) {
              const foundMusic = musicResult.data[0];
              setMusicData({
                id: profileData.music.musicId || foundMusic.id,
                song: profileData.music.song,
                artist: profileData.music.artist,
                album: foundMusic.album.title,
                image: foundMusic.album.cover_medium || foundMusic.album.cover,
                preview: foundMusic.preview,
              });
            } else {
              setMusicData((prev) => ({
                ...prev,
                id: profileData.music.musicId,
                song: profileData.music.song,
                artist: profileData.music.artist,
              }));
            }
          } catch (error) {
            console.error("음악 재검색 오류:", error);
            setMusicData((prev) => ({
              ...prev,
              id: profileData.music.musicId,
              song: profileData.music.song,
              artist: profileData.music.artist,
            }));
          } finally {
            setIsMusicDataLoading(false);
          }
        } else {
          setIsMusicDataLoading(false);
        }
      } catch (error) {
        console.error("❌ 프로필 로딩 에러:", error);
        setSaveError(error.message);
        setIsImageLoading(false);
        setIsMusicDataLoading(false);

        // 토큰 관련 에러인 경우 로그인 페이지로 리다이렉트
        if (
          error.message.includes("로그인") ||
          error.message.includes("인증")
        ) {
          // window.location.href = '/login';
        }
      }
    };

    loadProfile();
  }, []);

  // 편집 시작 함수
  const startEditing = () => {
    // 현재 저장된 값들로 편집 폼 초기화
    setEditedUsername(userName);
    setEditedQuoteTitle(data.quote.title);
    setEditedQuoteText(data.quote.text);
    setSaveError(null); // 에러 초기화
    setIsEditing(true);
  };

  // 저장 함수 (백엔드 연결)
  const handleSave = async () => {
    try {
      // 요청 데이터 구성
      const profileData = {
        name: editedUsername,
        coverColor: selectedColor.replace("#", ""), // # 제거
        music: {
          musicId: musicData.id ? musicData.id.toString() : "unknown",
          song: musicData.song,
          artist: musicData.artist,
        },
        quote: {
          title: editedQuoteTitle,
          text: editedQuoteText,
        },
      };

      console.log("전송할 데이터:", profileData);

      // 백엔드에 업데이트 요청
      await updateProfile(profileData);

      // 성공시 로컬 상태 업데이트
      setData((prevData) => ({
        ...prevData,
        user: { ...prevData.user, username: editedUsername },
        quote: {
          ...prevData.quote,
          title: editedQuoteTitle,
          text: editedQuoteText,
        },
      }));

      // 실제 userName도 업데이트
      setUserName(editedUsername);

      // 편집 모드 종료
      setIsEditing(false);
    } catch (error) {
      alert(`프로필 저장에 실패했습니다: ${error.message}`);
    }
  };

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    setCoverColor(color);
    setIsColorPickerOpen(false);
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        // 먼저 미리보기용으로 로컬 URL 설정
        const localImageUrl = URL.createObjectURL(file);
        setSelectedImage(localImageUrl);

        // 편집 모드일 때만 서버에 업로드
        if (isEditing) {
          const uploadedImageUrl = await uploadProfileImage(file);
          console.log("업로드 결과 URL:", uploadedImageUrl);

          if (uploadedImageUrl) {
            setSelectedImage(uploadedImageUrl);
            alert("프로필 이미지가 업로드되었습니다!");
          } else {
            console.warn(
              "서버에서 이미지 URL을 반환하지 않았지만 업로드는 성공한 것 같습니다."
            );
          }
        }
      } catch (error) {
        console.error("이미지 업로드 오류:", error);
        alert(`이미지 업로드에 실패했습니다: ${error.message}`);
        console.log("미리보기는 유지됩니다.");
      }
    }
  };

  const closeModal = () => {
    setShowMusicSearch(false);
    setSearchQuery("");
    setSearchResults([]);
    setError(null);
    previewAudioRef.current?.pause();
    setPreviewPlayingIndex(null);
  };

  return (
    <div className={styles.wrapper}>
      <Nav />
      {isEditing && <div className={styles.overlay}></div>}

      <div className={styles.container}>
        <div className={styles.imageWrapper}>
          {isEditing && (
            <label htmlFor="imageUpload" className={styles.cameraIconWrapper}>
              <FiCamera className={styles.cameraIcon} />
              {isUploadingImage && (
                <div className={styles.uploadingIndicator}>업로드 중...</div>
              )}
            </label>
          )}
          <label htmlFor="imageUpload">
            {isImageLoading ? (
              <div className={styles.imageLoadingContainer}>
                <div className={styles.imageLoadingSpinner}></div>
              </div>
            ) : (
              <img
                src={selectedImage || "assets/images/Mypagepicture.png"}
                alt="프로필"
                className={styles.profileImage}
              />
            )}
          </label>
          {isEditing && (
            <input
              id="imageUpload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
              disabled={isUploadingImage}
            />
          )}
        </div>

        <div className={styles.infoSection}>
          <div className={styles.nameRow}>
            {isEditing ? (
              <>
                <input
                  className={styles.usernameInput}
                  value={editedUsername}
                  onChange={(e) => setEditedUsername(e.target.value)}
                />
                <button
                  className={styles.coverColorBtn}
                  onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
                >
                  커버색상
                </button>
                {isColorPickerOpen && (
                  <div className={styles.colorPicker}>
                    {[
                      "#b4005c",
                      "#e85454",
                      "#b681f2",
                      "#5f6d4e",
                      "#ffaa00",
                      "#89e1ff",
                      "#f4b2bc",
                      "#ffcfff",
                      "#4cb8b3",
                      "#c275b7",
                      "#e65c00",
                      "#1561b3",
                      "#b28f85",
                      "#ffe600",
                      "#444c6a",
                      "#c90000",
                    ].map((color) => (
                      <div
                        key={color}
                        className={styles.colorBox}
                        style={{ backgroundColor: color }}
                        onClick={() => handleColorSelect(color)}
                      />
                    ))}
                    <div
                      className={styles.moreColors}
                      onClick={() =>
                        setShowCustomColorInput(!showCustomColorInput)
                      }
                    >
                      <div className={styles.gradientDot}></div>
                      더보기 +
                    </div>
                    {showCustomColorInput && (
                      <div className={styles.customColorInputWrapper}>
                        <HexColorPicker
                          color={customColor}
                          onChange={setCustomColor}
                        />
                        <button
                          className={styles.applyBtn}
                          onClick={() => handleColorSelect(customColor)}
                        >
                          적용
                        </button>
                      </div>
                    )}
                  </div>
                )}
                <span className={styles.subtext}>
                  작성한 구절 {quoteCount}개
                </span>
              </>
            ) : (
              <>
                <span className={styles.username}>{userName}</span>
                <span className={styles.subtext}>
                  작성한 구절 {quoteCount}개
                </span>
              </>
            )}
          </div>

          <div className={styles.lowerSection}>
            <div
              className={`${styles.quoteBox} ${
                isEditing ? styles.editingQuoteBox : ""
              }`}
            >
              {isEditing ? (
                <>
                  <input
                    className={styles.quoteTitleInput}
                    value={editedQuoteTitle}
                    onChange={(e) => setEditedQuoteTitle(e.target.value)}
                    style={{ color: selectedColor }}
                  />
                  <textarea
                    className={styles.quoteTextArea}
                    value={editedQuoteText}
                    onChange={(e) => setEditedQuoteText(e.target.value)}
                    style={{ color: selectedColor }}
                  />
                  <button
                    className={styles.completeBtn}
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    {isSaving ? "저장 중..." : "완료"}
                  </button>
                </>
              ) : (
                <>
                  <h3
                    className={styles.quoteTitle}
                    style={{ color: selectedColor }}
                  >
                    {data.quote.title}
                  </h3>
                  <p
                    className={styles.quoteText}
                    style={{ color: selectedColor }}
                  >
                    {data.quote.text}
                  </p>
                </>
              )}
            </div>

            {/* 에러 메시지 표시 */}
            {saveError && (
              <div className={styles.errorMessage}>오류: {saveError}</div>
            )}

            <div className={styles.actionSection}>
              <div className={styles.buttons}>
                <button
                  className={styles.btn}
                  onClick={startEditing}
                  style={{ color: selectedColor }}
                >
                  <FiSettings className={styles.icon} />
                  프로필 편집
                </button>
              </div>

              <div
                className={`${styles.music} ${isPlaying ? styles.playing : ""}`}
                style={{
                  backgroundColor: isEditing
                    ? "rgba(255, 255, 255, 0.9)"
                    : "rgba(255, 255, 255, 0.5)",
                  color: selectedColor,
                  cursor: isEditing ? "pointer" : "default",
                }}
                onClick={() => isEditing && setShowMusicSearch(true)}
              >
                {isMusicDataLoading ? (
                  <div className={styles.musicLoadingContainer}>
                    <div className={styles.musicLoadingSpinner}></div>
                    <div className={styles.musicLoadingText}>
                      음악 정보 불러오는 중...
                    </div>
                  </div>
                ) : (
                  <>
                    {musicData.image && (
                      <img
                        src={musicData.image}
                        alt="앨범 커버"
                        className={styles.albumCoverImage}
                      />
                    )}
                    <button
                      className={styles.playButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePlayMusic();
                      }}
                      style={{ color: selectedColor }}
                    >
                      {isPlaying ? (
                        <FaPause className={styles.playIcon} />
                      ) : (
                        <FaPlay className={styles.playIcon} />
                      )}
                    </button>
                    <div className={styles.musicInfo}>
                      <p ref={songNameRef} className={styles.songname}>
                        {musicData.song}
                      </p>
                      <span ref={artistRef} className={styles.artist}>
                        {musicData.artist}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 음악 검색 모달 */}
      {showMusicSearch && (
        <div className={styles.musicSearchModal}>
          <div className={styles.musicSearchContainer}>
            <div className={styles.searchHeader}>
              <h3>곡을 검색해주세요</h3>
              <button className={styles.closeBtn} onClick={closeModal}>
                ✕
              </button>
            </div>

            <div className={styles.searchInputContainer}>
              <input
                type="text"
                placeholder="곡명, 아티스트를 검색해보세요"
                className={styles.musicSearchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className={styles.searchIcon}>🔍</button>
            </div>

            <div className={styles.musicList}>
              {isMusicLoading && (
                <div className={styles.loading}>검색 중...</div>
              )}
              {error && <div className={styles.errorMessage}>{error}</div>}
              {!isMusicLoading &&
                !error &&
                searchResults.length === 0 &&
                searchQuery && (
                  <div className={styles.loading}>검색 결과가 없습니다.</div>
                )}
              {!isMusicLoading && !error && searchQuery === "" && (
                <div className={styles.loading}>검색어를 입력해주세요.</div>
              )}

              {searchResults.map((music, index) => (
                <div
                  key={index}
                  className={styles.musicItem}
                  onClick={() => selectMusic(music)}
                >
                  <div className={styles.albumCover}>
                    {music.album.cover_small ? (
                      <img
                        src={music.album.cover_small}
                        alt={music.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                      />
                    ) : (
                      <span style={{ fontSize: "20px" }}>🎵</span>
                    )}
                  </div>
                  <div className={styles.musicInfoModal}>
                    <div className={styles.songTitle}>{music.title}</div>
                    <div className={styles.artistName}>{music.artist.name}</div>
                  </div>
                  <button
                    className={styles.playBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePreviewMusic(index, music.preview);
                    }}
                  >
                    {previewPlayingIndex === index ? "⏸" : "▶"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 오디오 엘리먼트 */}
      {musicData.preview && (
        <audio
          ref={audioRef}
          src={musicData.preview}
          onEnded={() => setIsPlaying(false)}
        />
      )}
      <audio ref={previewAudioRef} />
    </div>
  );
}
