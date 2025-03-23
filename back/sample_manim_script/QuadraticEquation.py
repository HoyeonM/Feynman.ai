from manim import *
from manim_voiceover import VoiceoverScene
from manim_voiceover.services.gtts import GTTSService

class QuadraticEquation(VoiceoverScene):
    def construct(self):
        self.set_speech_service(GTTSService(tld="com"))

        # === Title ===
        title = Title("Solving x² - 7 = 9", font_size=60)
        with self.voiceover(text="Let's solve a simple quadratic equation: x squared minus seven equals nine."):
            self.play(Write(title))
            self.wait(1)

        self.play(FadeOut(title))

        # === Step 1: Original Equation ===
        eq1 = MathTex("x^2 - 7 = 9", font_size=72)
        with self.voiceover(text="Start with the equation: x squared minus seven equals nine."):
            self.play(Write(eq1))
            self.wait(1)

        # === Step 2: Add 7 to both sides ===
        eq2 = MathTex("x^2 = 9 + 7", font_size=72).next_to(eq1, DOWN, buff=0.8)
        with self.voiceover(text="Add seven to both sides."):
            self.play(Write(eq2))
            self.wait(0.5)

        # === Step 3: Take square root directly ===
        eq4 = MathTex("x = \\pm 4", font_size=72).next_to(eq2, DOWN, buff=0.8)
        with self.voiceover(text="Now simplify and take the square root. x equals plus or minus four."):
            self.play(Write(eq4))
            self.wait(1.5)

        # === Outro ===
        self.play(FadeOut(eq1, eq2, eq4))

        outro = Tex("Thanks for watching!", font_size=50).set_color(BLUE)
        with self.voiceover(text="Thanks for watching."):
            self.play(Write(outro))
            self.wait(2)
