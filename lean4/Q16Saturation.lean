/-
  lean4/Q16Saturation.lean — Signed 32-Bit Q16.16 Saturation & Safe-Radius Proofs
  Proves overflow clamping invariants for Q16.16 arithmetic and non-zero positivity
  for the branchless safe-radius guard used in Toy 06.

  Signed-off-by: Borealis Serenity Hedling <chguard-sentinel@vaked.dev>
-/

namespace NDH.Verification.Q16Saturation

def INT32_MIN : Int := -2147483648
def INT32_MAX : Int :=  2147483647
def Q_ONE     : Int :=  65536

/-- Saturating 32-bit clamping function matching qAdd / qSub / qMul in core.js. -/
def clampInt32 (x : Int) : Int :=
  if x > INT32_MAX then INT32_MAX
  else if x < INT32_MIN then INT32_MIN
  else x

def qAdd (a b : Int) : Int := clampInt32 (a + b)
def qSub (a b : Int) : Int := clampInt32 (a - b)

/-- Branchless safe-radius guard matching safeRadiusQ16 in Toy 06. -/
def safeRadiusQ16 (r : Int) : Int :=
  let absR := if r < 0 then -r else r
  if absR = 0 then 1 else absR

/-- Theorem 1: Saturating clamp always remains inside signed 32-bit bounds. -/
theorem clampInt32_bounds (x : Int) :
    INT32_MIN ≤ clampInt32 x ∧ clampInt32 x ≤ INT32_MAX := by
  unfold clampInt32 INT32_MIN INT32_MAX
  split <;> split <;> omega

/-- Theorem 2: qAdd never overflows or underflows signed 32-bit integer range. -/
theorem qAdd_safe (a b : Int) :
    INT32_MIN ≤ qAdd a b ∧ qAdd a b ≤ INT32_MAX :=
  clampInt32_bounds (a + b)

/-- Theorem 3: qSub never overflows or underflows signed 32-bit integer range. -/
theorem qSub_safe (a b : Int) :
    INT32_MIN ≤ qSub a b ∧ qSub a b ≤ INT32_MAX :=
  clampInt32_bounds (a - b)

/-- Theorem 4: safeRadiusQ16 is strictly positive (>= 1 LSB) for every integer input, preventing division by zero. -/
theorem safeRadiusQ16_positive (r : Int) :
    1 ≤ safeRadiusQ16 r := by
  unfold safeRadiusQ16
  split <;> split <;> omega

end NDH.Verification.Q16Saturation
