const calculateResult = (
    answers,
    totalMarks,
    passingMarks
) => {
    const score = answers.reduce(
        (total, answer) =>
            total + answer.marksAwarded,
        0
    );

    const percentage =
        totalMarks > 0
            ? Number(
                (
                    (score / totalMarks) *
                    100
                ).toFixed(2)
            )
            : 0;

    const isPassed =
        score >= passingMarks;

    return {
        score,
        totalMarks,
        percentage,
        isPassed,
    };
};

module.exports = {
    calculateResult,
};