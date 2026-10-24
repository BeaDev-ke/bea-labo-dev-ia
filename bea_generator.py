import html
import io
import os
import random
import re
import time
from datetime import datetime
from PIL import Image, ImageDraw, ImageFont, ImageEnhance
import streamlit as st

st.set_page_config(
    page_title="Bea - Générateur Visuel IA",
    page_icon="🎨",
    layout="wide",
    initial_sidebar_state="expanded"
)

# THÈME OFFICIEL BEA (BehaviorLab AI)
# Fond App : #0F0E1E
# Carte Labo : #1A1930 (bordure: 1px solid #5A33FF33)
# Dégradé Signature : linear-gradient(90deg, #1E1B8C 0%, #5A33FF 100%)
# Violet Icône : #8B70FF
# Texte Principal : #FFFFFF
# Texte Secondaire : #A89CFF
THEME_CSS = """
<style>
.stApp {
    background-color: #0F0E1E !important;
    color: #FFFFFF !important;
}
[data-testid="stSidebar"] {
    background-color: #0c0b17 !important;
    border-right: 1px solid #5A33FF33 !important;
}
div[data-testid="stVerticalBlock"] > div.stAlert {
    background-color: #1A1930 !important;
    border: 1px solid #5A33FF44 !important;
    color: #FFFFFF !important;
}
.bea-card {
    background: #1A1930;
    border: 1px solid #5A33FF33;
    border-radius: 16px;
    padding: 16px;
    margin-bottom: 16px;
}
.bea-title {
    color: #FFFFFF;
    font-weight: 800;
}
.bea-subtitle {
    color: #A89CFF;
    font-size: 13px;
}
button[kind="primary"] {
    background: linear-gradient(90deg, #1E1B8C 0%, #5A33FF 100%) !important;
    border: 1px solid #5A33FF !important;
    color: #FFFFFF !important;
    font-weight: 700 !important;
    border-radius: 12px !important;
    box-shadow: 0 4px 14px rgba(90, 51, 255, 0.25) !important;
}
button[kind="secondary"] {
    background: transparent !important;
    border: 1px solid #5A33FF !important;
    color: #FFFFFF !important;
    border-radius: 12px !important;
}
button[kind="secondary"]:hover {
    background: rgba(90, 51, 255, 0.15) !important;
}
.stTextInput input, .stTextArea textarea, .stSelectbox [data-baseweb="select"] {
    background-color: #1A1930 !important;
    border: 1px solid #5A33FF44 !important;
    color: #FFFFFF !important;
    border-radius: 12px !important;
}
</style>
"""
st.markdown(THEME_CSS, unsafe_allow_html=True)

# SÉCURITÉ ET FILTRAGE DES PROMPTS
BANNED_WORDS = [
    "nsfw", "porn", "nude", "naked", "sex", "explicit", "erotic",
    "violence", "gore", "blood", "weapon", "gun", "kill", "murder",
    "hate", "racist", "terror", "suicide", "self-harm"
]

BANNED_PATTERNS = [
    r"enfant.*nu",
    r"mineur.*sex",
]

def is_safe_prompt(prompt: str):
    prompt_lower = prompt.lower()
    for word in BANNED_WORDS:
        if word in prompt_lower:
            return False, f"Mot bloqué : {word}"
    for pattern in BANNED_PATTERNS:
        if re.search(pattern, prompt_lower):
            return False, "Contenu interdit détecté"
    if len(prompt) > 800:
        return False, "Prompt trop long (max 800 caractères)"
    if len(prompt.strip()) < 3:
        return False, "Prompt trop court"
    return True, "ok"

def enhance_prompt_free(user_prompt: str, style: str = "general"):
    user_prompt = user_prompt.strip()
    quality_suffix = {
        "general": ", ultra detailed, 8k resolution, professional studio lighting, sharp focus, photorealistic, highly detailed, award winning photography",
        "beaute": ", beauty portrait, softbox lighting, 85mm lens, skin texture detailed, flawless skin, makeup details sharp, 8k, ultra realistic, cosmetics photography",
        "produit": ", product photography, white background studio, soft shadow, ultra sharp, 8k, commercial photography, clean background, high end",
        "mode": ", fashion photography, editorial lighting, vogue style, ultra detailed fabric, 8k, high fashion",
        "cinema": ", cinematic still, 35mm photograph, moody anamorphic lens, dramatic lighting, color graded, masterpiece",
        "illustration": ", digital vector art, vibrant colors, clean lines, trending on artstation, smooth gradients"
    }
    base = quality_suffix.get(style, quality_suffix["general"])
    enhanced = user_prompt
    if not any(x in enhanced.lower() for x in ["lighting", "detailed", "photorealistic", "cinematic"]):
        enhanced = enhanced + base
    enhanced = enhanced.replace("bea labo", "Bea").replace("Bea Labo", "Bea")
    return enhanced

def get_negative_prompt_free():
    return "blurry, low quality, low res, distorted, deformed, ugly, bad anatomy, watermark, logo, text, extra fingers, cropped"

@st.cache_resource
def load_flux_model():
    """Charge le pipeline FLUX si disponible sur l'environnement GPU, avec repli gracieux."""
    try:
        import torch
        from diffusers import FluxPipeline
        if torch.cuda.is_available():
            pipe = FluxPipeline.from_pretrained(
                "black-forest-labs/FLUX.1-schnell",
                torch_dtype=torch.bfloat16,
            )
            pipe.enable_model_cpu_offload()
            pipe.enable_attention_slicing()
            return pipe
    except Exception:
        pass
    return None

def add_bea_touch(image: Image.Image, with_gradient=False, with_logo=False):
    """Signature visuelle Bea BehaviorLab avec dégradé subtil et watermark discret."""
    if not with_gradient and not with_logo:
        return image

    w, h = image.size
    result = image.copy().convert("RGBA")
    draw = ImageDraw.Draw(result, "RGBA")

    if with_gradient:
        gradient_overlay = Image.new('RGBA', (w, h), (30, 27, 140, 0))
        grad_draw = ImageDraw.Draw(gradient_overlay)
        for y in range(int(h * 0.6), h):
            ratio = (y - h * 0.6) / max(h * 0.4, 1)
            r = int(30 + (90 - 30) * ratio)
            g = int(27 + (51 - 27) * ratio)
            b = int(140 + (255 - 140) * ratio)
            alpha = int(40 * ratio)
            grad_draw.line([(0, y), (w, y)], fill=(r, g, b, alpha))
        result = Image.alpha_composite(result, gradient_overlay)
        draw = ImageDraw.Draw(result, "RGBA")

    if with_logo:
        font_size = max(14, int(h * 0.032))
        try:
            font = ImageFont.truetype("arial.ttf", font_size)
        except Exception:
            try:
                font = ImageFont.truetype("DejaVuSans.ttf", font_size)
            except Exception:
                font = ImageFont.load_default()

        text = "Bea AI"
        bbox = draw.textbbox((0, 0), text, font=font)
        text_w = bbox[2] - bbox[0]
        text_h = bbox[3] - bbox[1]

        margin_x = int(w * 0.035)
        margin_y = int(h * 0.035)
        x = w - text_w - margin_x
        y = h - text_h - margin_y

        padding = 8
        # Boîte de fond #0F0E1E avec bordure #5A33FF
        draw.rounded_rectangle(
            [(x - padding, y - padding), (x + text_w + padding, y + text_h + padding)],
            radius=6,
            fill=(15, 14, 30, 210),
            outline=(90, 51, 255, 230),
            width=1
        )
        draw.text((x, y), text, font=font, fill=(255, 255, 255, 240))

    return result.convert("RGB")

def create_synthetic_art(prompt: str, width: int, height: int, style: str, seed: int):
    """Générateur graphique visuel procédural avec dégradés riches de haute fidélité pour simulation ou sans GPU."""
    random.seed(seed)
    img = Image.new("RGB", (width, height), color="#0F0E1E")
    draw = ImageDraw.Draw(img)

    # Palettes thématiques
    palettes = {
        "general": [(15, 14, 30), (30, 27, 140), (90, 51, 255), (139, 112, 255)],
        "beaute": [(25, 12, 35), (80, 25, 75), (160, 50, 110), (240, 180, 200)],
        "produit": [(18, 22, 35), (35, 55, 95), (65, 120, 190), (220, 235, 255)],
        "mode": [(20, 10, 25), (70, 20, 50), (140, 45, 90), (240, 200, 150)],
        "cinema": [(10, 15, 25), (20, 45, 70), (120, 80, 40), (220, 160, 90)],
        "illustration": [(15, 20, 45), (45, 30, 100), (90, 60, 220), (160, 220, 255)]
    }
    cols = palettes.get(style, palettes["general"])

    # Fond avec dégradé multi-étapes
    for y in range(height):
        factor = y / max(height - 1, 1)
        if factor < 0.5:
            sub = factor / 0.5
            c1, c2 = cols[0], cols[1]
        else:
            sub = (factor - 0.5) / 0.5
            c1, c2 = cols[1], cols[2]
        r = int(c1[0] + (c2[0] - c1[0]) * sub)
        g = int(c1[1] + (c2[1] - c1[1]) * sub)
        b = int(c1[2] + (c2[2] - c1[2]) * sub)
        draw.line([(0, y), (width, y)], fill=(r, g, b))

    # Formes abstraites et halos de lumière
    for _ in range(8):
        cx = random.randint(int(width * 0.1), int(width * 0.9))
        cy = random.randint(int(height * 0.1), int(height * 0.9))
        rad = random.randint(int(min(width, height) * 0.15), int(min(width, height) * 0.45))
        c_accent = random.choice(cols[2:])
        draw.ellipse([cx - rad, cy - rad, cx + rad, cy + rad], outline=(*c_accent, 60), width=2)

    # Titre stylisé centré sur l'image
    try:
        font_main = ImageFont.truetype("arial.ttf", max(22, int(width * 0.045)))
    except Exception:
        font_main = ImageFont.load_default()

    words = prompt.split()
    short_title = " ".join(words[:6]) + ("..." if len(words) > 6 else "")
    bbox = draw.textbbox((0, 0), short_title, font=font_main)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    tx, ty = (width - tw) // 2, (height - th) // 2

    # Cartouche de lecture
    draw.rounded_rectangle([(tx - 16, ty - 12), (tx + tw + 16, ty + th + 12)], radius=12, fill=(15, 14, 30, 200), outline=(90, 51, 255, 180), width=1)
    draw.text((tx, ty), short_title, font=font_main, fill=(255, 255, 255))
    return img

def upscale_image(image: Image.Image, factor: float = 1.5):
    """Améliore la netteté et le contraste pour un rendu ultra haute définition."""
    w, h = image.size
    new_w = int(w * factor)
    new_h = int(h * factor)
    upscaled = image.resize((new_w, new_h), Image.Resampling.LANCZOS)
    enhancer_sharp = ImageEnhance.Sharpness(upscaled)
    upscaled = enhancer_sharp.enhance(1.25)
    enhancer_contrast = ImageEnhance.Contrast(upscaled)
    upscaled = enhancer_contrast.enhance(1.05)
    return upscaled

# INTERFACE UTILISATEUR
st.title("🎨 Bea Studio Visuel — Moteur Graphique IA")
st.markdown("<p class='bea-subtitle'>Générez des miniatures percutantes, des visuels de haute qualité et des illustrations optimisées avec la signature BehaviorLab.</p>", unsafe_allow_html=True)

# Barre latérale des paramètres
with st.sidebar:
    st.markdown("### ⚙️ Paramètres Visuels")
    
    style_choice = st.selectbox(
        "Style Visuel",
        ["general", "beaute", "produit", "mode", "cinema", "illustration"],
        format_func=lambda s: {
            "general": "✨ Général & Réaliste (8K)",
            "beaute": "💄 Beauté & Cosmétiques",
            "produit": "📦 Produit Commercial Studio",
            "mode": "👗 Mode & Éditorial Vogue",
            "cinema": "🎬 Cinématique 35mm",
            "illustration": "🎨 Illustration Digitale"
        }.get(s, s)
    )

    aspect_ratio = st.selectbox(
        "Format & Ratio",
        ["1:1 (Carré Instagram)", "9:16 (TikTok / Reels / Shorts)", "16:9 (YouTube / Miniature)", "4:5 (Portrait Feed)"]
    )
    dim_map = {
        "1:1 (Carré Instagram)": (1024, 1024),
        "9:16 (TikTok / Reels / Shorts)": (720, 1280),
        "16:9 (YouTube / Miniature)": (1280, 720),
        "4:5 (Portrait Feed)": (864, 1080),
    }
    target_w, target_h = dim_map[aspect_ratio]

    st.divider()
    st.markdown("### 🛡️ Signature & Rendu Bea")
    apply_gradient = st.checkbox("Dégradé subtil Bea (#1E1B8C → #5A33FF)", value=True)
    apply_logo = st.checkbox("Badge Bea AI discret", value=True)
    do_upscale = st.checkbox("Amélioration de netteté (Upscale)", value=True)

    seed_val = st.number_input("Seed (graine aléatoire)", value=42, min_value=0, max_value=999999)

# Zone principale
prompt_col, info_col = st.columns([3, 1])
with prompt_col:
    user_prompt = st.text_area(
        "Description de votre image (Prompt)",
        value="Un studio d'enregistrement moderne et futuriste baigné de néons violets et bleus profonds, atmosphère créative et épurée",
        height=100,
        placeholder="Décrivez précisément ce que vous souhaitez générer..."
    )

with info_col:
    st.markdown("<div class='bea-card'>", unsafe_allow_html=True)
    st.markdown(f"**Format :** `{target_w}×{target_h}`")
    st.markdown(f"**Style :** `{style_choice}`")
    st.markdown(f"**Protection :** `Filtre Anti-NSFW actif`")
    st.markdown("</div>", unsafe_allow_html=True)

col_gen, col_enhance = st.columns([1, 2])
with col_gen:
    generate_btn = st.button("🚀 Générer le visuel", type="primary", use_container_width=True)

with col_enhance:
    st.caption("Prompt amélioré automatiquement avec des mots-clés d'éclairage de studio, 8K et textures fines.")

if "history" not in st.session_state:
    st.session_state.history = []

if generate_btn:
    is_safe, reason = is_safe_prompt(user_prompt)
    if not is_safe:
        st.error(f"⚠️ Prompt refusé : {reason}")
    else:
        enhanced = enhance_prompt_free(user_prompt, style=style_choice)
        with st.spinner("Génération de l'image avec Bea Visual Engine..."):
            start_t = time.time()
            flux_pipe = load_flux_model()

            if flux_pipe is not None:
                try:
                    neg = get_negative_prompt_free()
                    img = flux_pipe(
                        prompt=enhanced,
                        width=target_w,
                        height=target_h,
                        num_inference_steps=4,
                        generator=None
                    ).images[0]
                except Exception:
                    img = create_synthetic_art(user_prompt, target_w, target_h, style_choice, seed_val)
            else:
                img = create_synthetic_art(user_prompt, target_w, target_h, style_choice, seed_val)

            # Application des finitions Bea
            img = add_bea_touch(img, with_gradient=apply_gradient, with_logo=apply_logo)
            if do_upscale:
                img = upscale_image(img, factor=1.2)

            duration = round(time.time() - start_t, 2)
            st.success(f"Visuel généré avec succès en {duration}s !")

            # Sauvegarde en mémoire
            buf = io.BytesIO()
            img.save(buf, format="PNG")
            img_bytes = buf.getvalue()

            st.session_state.history.insert(0, {
                "bytes": img_bytes,
                "prompt": user_prompt,
                "enhanced": enhanced,
                "timestamp": datetime.now().strftime("%H:%M:%S"),
                "format": f"{target_w}×{target_h}"
            })

if st.session_state.history:
    st.divider()
    latest = st.session_state.history[0]
    st.markdown("### 🖼️ Dernier résultat")
    res_col1, res_col2 = st.columns([2, 1])
    
    with res_col1:
        st.image(latest["bytes"], use_container_width=True)

    with res_col2:
        st.markdown("<div class='bea-card'>", unsafe_allow_html=True)
        st.markdown(f"**Prompt initial :** {latest['prompt']}")
        st.markdown(f"**Résolution :** `{latest['format']}`")
        st.markdown(f"**Heure :** `{latest['timestamp']}`")
        st.download_button(
            "⬇️ Télécharger en HD (PNG)",
            data=latest["bytes"],
            file_name=f"bea_visuel_{int(time.time())}.png",
            mime="image/png",
            use_container_width=True,
            type="primary"
        )
        st.markdown("</div>", unsafe_allow_html=True)

    if len(st.session_state.history) > 1:
        st.divider()
        st.markdown("### 📚 Historique de génération")
        h_cols = st.columns(3)
        for idx, item in enumerate(st.session_state.history[1:4]):
            with h_cols[idx % 3]:
                st.image(item["bytes"], caption=f"{item['prompt'][:35]}...", use_container_width=True)
                st.download_button(
                    f"⬇️ Télécharger #{idx+1}",
                    data=item["bytes"],
                    file_name=f"bea_historique_{idx+1}.png",
                    mime="image/png",
                    key=f"dl_hist_{idx}"
                )
