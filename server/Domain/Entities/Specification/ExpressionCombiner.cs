using System.Linq.Expressions;

public static class ExpressionCombiner
{
    public static Expression<Func<T, bool>> And<T>(
        Expression<Func<T, bool>> expr1,
        Expression<Func<T, bool>> expr2)
    {
        var p = Expression.Parameter(typeof(T));
        var body = Expression.AndAlso(
            Expression.Invoke(expr1, p),
            Expression.Invoke(expr2, p)
        );
        return Expression.Lambda<Func<T, bool>>(body, p);
    }

    public static Expression<Func<T, bool>> Or<T>(
        Expression<Func<T, bool>> expr1,
        Expression<Func<T, bool>> expr2)
    {
        var p = Expression.Parameter(typeof(T));
        var body = Expression.OrElse(
            Expression.Invoke(expr1, p),
            Expression.Invoke(expr2, p)
        );
        return Expression.Lambda<Func<T, bool>>(body, p);
    }
}