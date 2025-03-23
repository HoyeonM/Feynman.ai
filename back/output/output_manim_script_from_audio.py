from manim import *
from manim_voiceover import VoiceoverScene
from manim_voiceover.services.gtts import GTTSService

class SolveQuadraticEquation(VoiceoverScene):
    def construct(self):
        self.set_speech_service(GTTSService())

        # Display the initial equation
        initial_equation = MathTex("x^2 - 2 = 9").to_edge(UP)
        self.play(Write(initial_equation))
        self.wait(1)

        with self.voiceover("Let's solve the equation, x squared minus 2 equals 9.") as v:
            self.wait(v.duration)

        # Move to the next step: add 2 to both sides
        step1 = MathTex("x^2 - 2 + 2 = 9 + 2").next_to(initial_equation, DOWN)
        self.play(Write(step1))
        self.wait(1)

        with self.voiceover("First, add 2 to both sides of the equation.") as v:
            self.wait(v.duration)

        # Simplify the equation
        simplified_eq = MathTex("x^2 = 11").next_to(step1, DOWN)
        self.play(Transform(step1, simplified_eq))
        self.wait(1)

        with self.voiceover("This simplifies to x squared equals 11.") as v:
            self.wait(v.duration)

        # Move to the next step: take the square root
        step2 = MathTex(r"x = \pm \sqrt{11}").next_to(simplified_eq, DOWN)
        self.play(Write(step2))
        self.wait(1)

        with self.voiceover("Taking the square root of both sides gives us x equals plus or minus square root of 11.") as v:
            self.wait(v.duration)

        # Conclusion
        conclusion = Tex("Thus, the solutions are ", r"$x = \sqrt{11}$", " and ", r"$x = -\sqrt{11}$").next_to(step2, DOWN)
        self.play(Write(conclusion))
        self.wait(1)

        with self.voiceover("Did you understand?") as v:
            self.wait(v.duration)

        # Clear the screen
        self.play(FadeOut(VGroup(initial_equation, step1, step2, conclusion)))
        self.wait(1)