        async function loadProfileImage() {
            const imgEl = document.getElementById("profileImg");
            const userId = sessionStorage.getItem("ID_USUARIO");
            if (!userId || !imgEl) return;

            try {
                const res = await fetch(`/aws/usuarios/${userId}/importar-imagem`);
                if (!res.ok) {
                    // imagem não existe ou outro erro: mantém o src padrão  
                    console.warn("Não foi possível carregar a imagem de perfil:", res.status);
                    return;
                }
                const { imageUrl } = await res.json();
                imgEl.src = imageUrl;
            } catch (err) {
                console.error("Erro ao carregar imagem de perfil:", err);
            }
        }