from manim import *
from manim_voiceover import VoiceoverScene
from manim_voiceover.services.gtts import GTTSService

class BasicAlgebra(VoiceoverScene):
    def construct(self):
        self.set_speech_service(GTTSService(lang="en", tld="ca"))

        # === Title Slide ===
        title = Title("Basic Algebra", font_size=65)

        with self.voiceover(text="Let's learn basic algebra by solving a simple equation.") as tracker:
            self.play(Write(title))
            self.wait(tracker.duration - 1)

        self.play(FadeOut(title))

        # === Equation: x + 2 = 5 ===
        eq = MathTex("x + 2 = 5", font_size=70)
        self.play(Write(eq))

        with self.voiceover(text="We start with the equation x plus two equals five."):
            self.wait(2)

        # === Step 1: Subtract 2 ===
        step1 = MathTex("x = 5 - 2", font_size=65).next_to(eq, DOWN, buff=0.6)
        with self.voiceover(text="To isolate x, subtract two from both sides."):
            self.play(Write(step1))
            self.wait(1)

        # === Step 2: Simplify ===
        step2 = MathTex("x = 3", font_size=70).next_to(step1, DOWN, buff=0.6)
        with self.voiceover(text="Now simplify. x equals three."):
            self.play(Write(step2))
            self.wait(1.5)

        # === Outro ===
        self.play(FadeOut(eq), FadeOut(step1), FadeOut(step2))

        thank_you = Tex("Thanks for watching!", font_size=50).set_color(PURPLE_E)
        with self.voiceover(text="Thanks for watching basic algebra."):
            self.play(Write(thank_you))
            self.wait(2)
