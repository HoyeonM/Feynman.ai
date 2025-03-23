from manim import *
from manim_voiceover import VoiceoverScene
from manim_voiceover.services.gtts import GTTSService

class BasicAlgebraExplanation(VoiceoverScene):
    def construct(self):
        self.set_speech_service(GTTSService())

        # Introduction
        intro_text = Text("Basic Algebra: Understanding Variables and Equations", font_size=36)
        intro_text.to_edge(UP)
        self.play(Write(intro_text))
        self.wait(1)

        with self.voiceover("Algebra is a branch of mathematics dealing with symbols and the rules for manipulating these symbols.") as tracker:
            self.wait(tracker.duration)

        # Variables
        variables_text = Text("Variables", font_size=30).next_to(intro_text, DOWN, buff=1)
        variable_example = MathTex("x, y, z", font_size=48).next_to(variables_text, DOWN)
        self.play(Write(variables_text))
        self.play(Write(variable_example))
        self.wait(1)

        with self.voiceover("In algebra, variables are symbols that represent numbers. They can take various values.") as tracker:
            self.wait(tracker.duration)

        # Equations
        self.play(FadeOut(variables_text), FadeOut(variable_example))
        equations_text = Text("Equations", font_size=30).next_to(intro_text, DOWN, buff=1)
        equation_example = MathTex("3x + 2 = 11", font_size=48).next_to(equations_text, DOWN)
        self.play(Write(equations_text))
        self.play(Write(equation_example))
        self.wait(1)

        with self.voiceover("An equation is a statement that two expressions are equal, involving one or more variables.") as tracker:
            self.wait(tracker.duration)

        # Solving Equations
        self.play(FadeOut(equations_text), Transform(equation_example, MathTex("3x = 9", font_size=48)))
        solved_equation = MathTex("x = 3", font_size=48).next_to(equation_example, DOWN)

        with self.voiceover("To solve an equation, we find the value of the variable that makes the equation true. For example, subtract 2 from both sides:") as tracker:
            self.wait(tracker.duration)

        self.play(Write(solved_equation))
        self.wait(1)

        with self.voiceover("Now, divide both sides by 3:") as tracker:
            self.wait(tracker.duration)

        # Conclusion
        self.play(FadeOut(equation_example), FadeOut(solved_equation))
        conclusion_text = Text("This is the basic concept of algebra, solving for unknowns in equations.", font_size=36).next_to(intro_text, DOWN, buff=1)
        self.play(Write(conclusion_text))
        self.wait(1)

        with self.voiceover("Algebra is fundamental in many fields of study and forms the basis for more advanced mathematics.") as tracker:
            self.wait(tracker.duration)

        self.play(FadeOut(conclusion_text), FadeOut(intro_text))
        self.wait(2)