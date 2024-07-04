== Sets
- $T$ - time (month)
\
== Data
- $S$ - goal
- $n$ - interest (month)
- $I_t$ - income in month t
- $E_t$ - essential spending in month t
- $m$ - number of month to achieve the goal
\
== Stages
- Months - $0 <= t <= m$
\
== State
- $S_t$ - amount left to save at the start of month t
\
== Action
- $X_t = [0, min(S_t, I_t - E_t)]$ - amount put into saving month t
\
== Value Function
$ V_t (S_t) = "minimum amount need to save in month t to achieve the goal on time" $
\
== Base Case
- No longer possible
$ forall t, S_t > sum_t^m (I_t - E_t) times (1+n)^(m-t) < "goal" -> V_t (S_t) = infinity $
- Due date of the goal
$ V_m = S_m $
\
== General Case
- explore the action space $X_t$ to find the optimal saving strategy that minimises the total saving amount \
$ V_t (S_t) = min(x + V_(t+1) (S_t - x times (1+n)^(m-t)), forall x in X_t) $
