from django.shortcuts import redirect
from django.http import HttpResponse
from social_django.utils import load_strategy, load_backend
from social_core.actions import do_complete
import jwt
from datetime import datetime, timedelta
from auth_app.models import User
import urllib.parse


def google_oauth_callback(request):
    try:
        state = request.GET.get('state')
        if not state:
            return redirect('https://versa-pink.vercel.app/login?error=Missing+state+parameter')

        strategy = load_strategy(request)
        backend = load_backend(
            strategy, 'google-oauth2', redirect_uri='https://versa-api-f9sl.onrender.com/auth/complete/google-oauth2/')

        # Validate state
        stored_state = strategy.session_get('google-oauth2_state')
        if state != stored_state:
            return redirect('https://versa-pink.vercel.app/login?error=Invalid+state+parameter')

        user = do_complete(
            backend,
            code=request.GET.get('code'),
            user=None,
            strategy=strategy,
            redirect_name='next',
            redirect_uri='https://versa-pink.vercel.app/callback'
        )

        if not user or not user.is_active:
            return redirect('https://versa-pink.vercel.app/login?error=Authentication+failed')

        token = jwt.encode(
            {
                "userId": str(user.id),
                "exp": int((datetime.utcnow() + timedelta(days=7)).timestamp()),
            },
            "QZ9ZfprdodU2BPUNO1dbS_NgMjfTlAdGuv4ybHmrO9VeLqlMWpbUIf3Y93Qbk8dkvndHWW9oMLTBkWA3sxmCww",
            algorithm="HS256",
        )

        redirect_url = f'https://versa-pink.vercel.app/callback?token={urllib.parse.quote(token)}'
        return redirect(redirect_url)
    except Exception as e:
        error_message = urllib.parse.quote(str(e))
        return redirect(f'https://versa-pink.vercel.app/login?error={error_message}')
