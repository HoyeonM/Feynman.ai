from manim import *
from manim_voiceover import VoiceoverScene
from manim_voiceover.services.gtts import GTTSService 

class QuadraticFormulaShort_English(VoiceoverScene):
    def construct(self):
        self.set_speech_service(GTTSService())

        # === Color scheme ===
        a_color = BLUE_E
        b_color = PINK
        c_color = GREEN_E
        delta_color = RED

        # === Title & Equation ===
        title = Title("Solving a Quadratic Equation", font_size=65)
        equation = MathTex("ax^2 + bx + c = 0", font_size=70).next_to(title, DOWN)
        equation.set_color_by_tex_to_color_map({"a": a_color, "b": b_color, "c": c_color})

        # === Completing the square ===
        comp_square = MathTex(
            r"\left(x + \frac{b}{2a}\right)^2 = \frac{b^2 - 4ac}{4a^2}",
            font_size=65
        ).next_to(equation, DOWN)
        comp_square.set_color_by_tex_to_color_map({"a": a_color, "b": b_color, "c": c_color})

        # === Final solution formula ===
        solution = MathTex(
            r"x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}",
            font_size=70
        ).next_to(comp_square, DOWN)
        solution.set_color_by_tex_to_color_map({
            "a": a_color, "b": b_color, "c": c_color
        })

        # === Delta case classification ===
        delta_cases = Tex(
            r"""
            \begin{itemize}
                \item If $\Delta < 0$: No real solutions
                \item If $\Delta = 0$: One real solution
                \item If $\Delta > 0$: Two distinct real solutions
            \end{itemize}
            """,
            font_size=40,
        ).next_to(solution, DOWN, buff=0.3)

        # === Visual emphasis ===
        delta_highlight = SurroundingRectangle(
            comp_square[0][13:18], color=delta_color, buff=0.15, stroke_width=4
        ).set_z_index(-1)

        result_box = SurroundingRectangle(
            solution,
            color=YELLOW,
            fill_color=PURPLE,
            fill_opacity=0.2,
            corner_radius=0.15,
            buff=0.15,
            stroke_width=4,
        ).set_z_index(-2)

        # === Animation sequence with voiceover ===
        with self.voiceover(text="Hello! In this short video, we will solve a quadratic equation.") as t:
            self.play(Write(title))
            self.play(Write(equation))

        with self.voiceover(text="Using the method of completing the square, we get this expression.") as t:
            self.play(Write(comp_square), Create(delta_highlight))

        with self.voiceover(text="From this, we derive the solution formula: minus b plus or minus the square root of delta over two a.") as t:
            self.play(Write(solution), Create(result_box))

        with self.voiceover(text="Depending on delta, we may get zero, one, or two real solutions.") as t:
            self.play(FadeIn(delta_cases))

        with self.voiceover(text="Thanks for watching! See you next time.") as t:
            goodbye = Tex("See you next time!", font_size=60).set_color(PURPLE_E)
            self.play(FadeOut(*self.mobjects), Write(goodbye))
            self.wait(2)