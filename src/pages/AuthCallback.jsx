import { useEffect, useRef } from "react";

export default function AuthCallback() {
    const calledRef = useRef(false);

    useEffect(() => {
        if (calledRef.current) return;
        calledRef.current = true;

        const url = new URL(window.location.href);
        const code = url.searchParams.get("code");
        if (!code) return;

        fetch("http://127.0.0.1:8000/api/auth/cognito/callback", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ code }),
        })
            .then(async (res) => {
                const data = await res.json();
                if (!res.ok) throw data;

                // ✅ 成功后把 code 从地址栏清掉，避免刷新/二次进入再次触发
                window.history.replaceState({}, document.title, "/");
                window.location.href = "/";
            })
            .catch((e) => {
                console.error("login failed:", e);
                alert("Login failed, check console.");
            });
    }, []);

    return <div>Signing you in...</div>;
}
