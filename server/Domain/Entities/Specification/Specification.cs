using System.Linq.Expressions;


public class Specification<T>
{
    public Expression<Func<T, bool>> Criteria { get; private set; } = x => true;

    public List<Expression<Func<T, object>>> Includes { get; } = new();

    public Expression<Func<T, object>>? OrderBy { get; private set; }
    public Expression<Func<T, object>>? OrderByDescending { get; private set; }

    public int? Skip { get; private set; }
    public int? Take { get; private set; }

    public Specification<T> Where(Expression<Func<T, bool>> expression)
    {
        Criteria = ExpressionCombiner.And(Criteria, expression);
        return this;
    }

    public Specification<T> Include(Expression<Func<T, object>> include)
    {
        Includes.Add(include);
        return this;
    }

    public Specification<T> ApplyPaging(int skip, int take)
    {
        Skip = skip;
        Take = take;
        return this;
    }

    public Specification<T> Order(Expression<Func<T, object>> order)
    {
        OrderBy = order;
        return this;
    }

    public Specification<T> OrderDesc(Expression<Func<T, object>> order)
    {
        OrderByDescending = order;
        return this;
    }
}