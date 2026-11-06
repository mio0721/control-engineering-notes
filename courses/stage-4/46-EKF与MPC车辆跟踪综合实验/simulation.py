"""Teaching example: nonlinear bicycle + EKF + box-constrained linear MPC.
Requires NumPy. Run: python simulation.py; output CSV is written in current directory.
No collision avoidance, steering-rate limit, reverse driving or safety fallback.
"""
from pathlib import Path
import numpy as np


def wrap(a):
    return np.arctan2(np.sin(a), np.cos(a))


def vehicle(x, delta, dt=.1, speed=2., wheelbase=2.5):
    X,Y,psi=x
    return np.array([X+dt*speed*np.cos(psi),Y+dt*speed*np.sin(psi),wrap(psi+dt*speed*np.tan(delta)/wheelbase)])


def prediction(A,B,N):
    n=A.shape[0]
    AA=np.vstack([np.linalg.matrix_power(A,i+1) for i in range(N)])
    BB=np.zeros((N*n,N))
    for i in range(N):
        for j in range(i+1):
            BB[i*n:(i+1)*n,j]=np.linalg.matrix_power(A,i-j)@B
    return AA,BB


def box_qp(H,g,bound,initial=None,tol=1e-7,max_iter=5000):
    """Projected gradient for an SPD box QP; reports infinity-norm gradient mapping."""
    alpha=1/np.linalg.eigvalsh(H)[-1]
    u=np.zeros_like(g) if initial is None else np.clip(initial,-bound,bound).copy()
    for _ in range(max_iter):
        nxt=np.clip(u-alpha*(H@u+g),-bound,bound)
        residual=np.max(np.abs(nxt-u))/alpha
        u=nxt
        if residual<tol:
            break
    if not np.isfinite(residual) or residual>1e-5:
        raise RuntimeError(f'QP did not converge: projected residual={residual:g}')
    return u,residual


def run(seed=7,use_ekf=True,N=20,bound=.35,steps=160):
    dt=.1;speed=2.;L=2.5
    A=np.array([[1,speed*dt],[0,1.]])
    B=np.array([speed**2*dt**2/(2*L),speed*dt/L])
    AA,BB=prediction(A,B,N)
    Qbar=np.kron(np.eye(N),np.diag([5.,2.]))
    H=2*(BB.T@Qbar@BB+.5*np.eye(N))
    G=2*BB.T@Qbar@AA
    R=np.diag(np.array([.05,.05,.01])**2)
    Q=np.diag([1e-5,1e-5,1e-5])
    P=np.diag([.2**2,.2**2,.1**2])
    truth=np.array([0.,.5,.08]);xm=np.array([0.,.3,0.])
    rng=np.random.default_rng(seed)
    noise=rng.normal(size=(steps,3))*np.array([.05,.05,.01])
    rows=[];warm=np.zeros(N)
    for k in range(steps):
        z=truth+noise[k];z[2]=wrap(z[2])
        innovation=z-xm;innovation[2]=wrap(innovation[2])
        K=np.linalg.solve((P+R).T,P.T).T
        estimate=xm+K@innovation;estimate[2]=wrap(estimate[2])
        M=np.eye(3)-K;P=M@P@M.T+K@R@K.T
        control_state=estimate[1:] if use_ekf else z[1:]
        U,residual=box_qp(H,G@control_state,bound,warm)
        applied=U[0];warm=np.r_[U[1:],U[-1]]
        rows.append([k*dt,*truth,*z,*estimate,applied,residual])
        # Both true plant and estimator receive exactly the applied command.
        truth=vehicle(truth,applied,dt,speed,L)
        psi=estimate[2]
        F=np.array([[1,0,-dt*speed*np.sin(psi)],[0,1,dt*speed*np.cos(psi)],[0,0,1]])
        xm=vehicle(estimate,applied,dt,speed,L)
        P=F@P@F.T+Q;P=(P+P.T)/2
    return np.array(rows)


if __name__=='__main__':
    rows=run()
    out=Path.cwd()/'simulation_results.csv'
    header='t,X,Y,psi,zX,zY,zpsi,estimateX,estimateY,estimatePsi,steering,qpResidual'
    np.savetxt(out,rows,delimiter=',',header=header,comments='')
    print(f'final lateral error={rows[-1,2]:.6f} m')
    print(f'lateral RMSE={np.sqrt(np.mean(rows[:,2]**2)):.6f} m')
    print(f'max abs steering={np.max(np.abs(rows[:,10])):.6f} rad')
    print(f'max QP projected residual={np.max(rows[:,11]):.3g}')
    print(f'CSV: {out}')
