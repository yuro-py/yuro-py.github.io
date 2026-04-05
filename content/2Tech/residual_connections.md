The 'thinking' code block in TRM:-

```
def latent recursion(x, y, z, n=6):
        for i in range(n): # latent reasoning
                z = net(x, y, z)
        y = net(y, z) # refine output answer
        return y, z
```

These two formulas in there are the actual driving force of "thinking/reasoning" computationally:-
a. z = net(x, y, z)   # latent reasoning
b. y = net(y, z)      # refine output answer

A rough bridge between how a human and TRM "thinks/solves":-
1. x -> We have the empty solvable grid. This doesn't change.
2. y -> Your current guess which you intuitively "believe" is correct. This can be wrong.
3. z -> This is the "scratchpad" where you "think" something like "ok so this is a 3x3 grid and I can see 2 and 4 already present, I will first of all stop thinking about 2 and 4 to reduce mental load and now next let's see which number can I put from 1-9 in this next box, ok this box is empty too and this number should match the pattern let's try......"

Now how does a human actually solves a hard puzzles?You don't see the grid and come up with an answer, instead it's a cycle of iterative reasoning, refining and guessing:
Step 1(Think) : You look at the puzzle(x), make a quick best-guess(y) for the first empty box you see, then you think for sometime and update your scratchpad(z) with new reasoning/deductions.
Step 2(Refine answer) : Based upon your updated scratchpad(z) and current guess(y), you find the errors and next guess, and refine the answer(y).
Step 3(Repeat) : Repeat from step 1. Reason, guess and refine until the entire puzzle grid is solved.

Now let's see if TRM maps human-thinking or not:-
```
def latent_recursion(x, y, z, n=6):
        for i in range(n): # latent reasoning
                z = net(x, y, z)   # <-- THIS IS THE "THINKING" STEP
        y = net(y, z)              # <-- THIS IS THE "REFINE ANSWER" STEP
        return y, z
```
This code is doing exactly what a human would do, but for a neural network.

Breaking those down:-
1. "z = net(x + y + z)" -> Thinking
    a. this formula adds x(constant puzzle), y(current guess) and z(scratchpad) and pushes the result through a neural network to return a new, improvised z(scratchpad). It repeats this thing 6 times.
    b. "Residual Connection" is where we add the current thinking with the previous thinking. This is just "adding you to yourself" thing.
    c. This mimics human thinking because we dont erase old memory while solving a puzzle, instead we keep building upon the previous step with new information. Hence "adding" makes sense here and even gives results.
2. "y = net(y, z)" -> Refining next answer
    a. After the model has done it's deep thinking 6 times, it verifies the current answer against the expected output, takes the latest z(thinking) and generates a new, improvised y(new best guess).
    b. This is when you are done with the rough work and finally write the step you are 100% confident in.

The "Human Behaviour" connection:-
Is "adding" really how humans think?
