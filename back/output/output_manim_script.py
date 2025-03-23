from manim import *
from manim_voiceover import VoiceoverScene
from manim_voiceover.services.gtts import GTTSService

class BasicAlgebraExample(VoiceoverScene):
    def construct(self):
        self.set_speech_service(GTTSService())

        # Title and introduction of the topic
        title = Title("Basic Algebra Example", color=BLUE)
        self.play(Write(title))
        self.wait(1)

        # Display the initial equation
        equation = MathTex("2x + 3 = 15", font_size=64)
        self.play(Write(equation))
        self.wait(1)

        # Explain the first step: subtracting 3 from both sides
        with self.voiceover("To solve for x, first subtract 3 from both sides."):
            subtract_step = MathTex("-3", font_size=64).next_to(equation, RIGHT)
            self.play(Write(subtract_step))
            self.wait(1)
            new_eq = MathTex("2x = 12", font_size=64).next_to(equation, DOWN, buff=1)
            self.play(TransformMatchingTex(equation, new_eq))
            self.remove(subtract_step)
            self.wait(1)

        # Explain the second step: dividing both sides by 2
        with self.voiceover("Next, divide both sides by 2 to isolate x."):
            divide_step = MathTex("\\div 2", font_size=64).next_to(new_eq, RIGHT)
            self.play(Write(divide_step))
            self.wait(1)
            final_eq = MathTex("x = 6", font_size=64).next_to(new_eq, DOWN, buff=1)
            self.play(TransformMatchingTex(new_eq, final_eq))
            self.remove(divide_step)
            self.wait(1)

        # Conclusion and fade out
        with self.voiceover("So, x equals 6. Did you understand?"):
            self.play(FadeIn(final_eq))
            self.wait(2)

        self.play(FadeOut(title), FadeOut(new_eq), FadeOut(final_eq))
        self.wait(1)