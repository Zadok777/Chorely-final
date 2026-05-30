import numpy as np
from PIL import Image, ImageDraw, ImageFont

PINK=(255,77,141); ORANGE=(255,140,66); LAV=(243,240,255); DARK=(45,45,58)
FONT="node_modules/@expo-google-fonts/nunito/800ExtraBold/Nunito_800ExtraBold.ttf"
SS=2  # supersample for crisp downscaled edges

def diag_gradient(S,c0,c1):
    xs=np.linspace(0,1,S); tx,ty=np.meshgrid(xs,xs)
    t=((tx+ty)/2.0)[...,None]
    arr=(np.array(c0,float)*(1-t)+np.array(c1,float)*t).astype('uint8')
    return Image.fromarray(arr,'RGB')

def bezier(p0,c,p1,n=30):
    out=[]
    for i in range(n+1):
        t=i/n
        x=(1-t)**2*p0[0]+2*(1-t)*t*c[0]+t**2*p1[0]
        y=(1-t)**2*p0[1]+2*(1-t)*t*c[1]+t**2*p1[1]
        out.append((x,y))
    return out

def smiley(S, mono=False):
    sc=S/100.0
    img=Image.new('RGBA',(S,S),(0,0,0,0))
    x0,y0,x1,y1=4*sc,4*sc,96*sc,96*sc; sw=6*sc
    col=DARK+(255,)
    if mono:
        d=ImageDraw.Draw(img)
        d.rounded_rectangle([x0,y0,x1,y1],radius=22*sc,outline=col,width=int(round(sw)))
    else:
        grad=diag_gradient(S,PINK,ORANGE).convert('RGBA')
        mask=Image.new('L',(S,S),0)
        ImageDraw.Draw(mask).rounded_rectangle([x0,y0,x1,y1],radius=22*sc,fill=255)
        img.paste(grad,(0,0),mask)
        d=ImageDraw.Draw(img)
        d.rounded_rectangle([x0+sw,y0+sw,x1-sw,y1-sw],radius=16*sc,fill=(255,255,255,255))
    er=5*sc
    for cx in (36*sc,64*sc):
        d.ellipse([cx-er,42*sc-er,cx+er,42*sc+er],fill=col)
    pts=bezier((30*sc,62*sc),(50*sc,82*sc),(70*sc,62*sc),30)
    d.line(pts,fill=col,width=int(round(5*sc)),joint='curve')
    cr=2.5*sc
    for px,py in (pts[0],pts[-1]):
        d.ellipse([px-cr,py-cr,px+cr,py+cr],fill=col)
    return img

def composed(final, frac, bg=None, mono=False, rgb=False):
    W=final*SS
    img=Image.new('RGBA',(W,W), (bg+(255,)) if bg else (0,0,0,0))
    m=int(frac*W); sm=smiley(m,mono=mono); off=(W-m)//2
    img.paste(sm,(off,off),sm)
    img=img.resize((final,final),Image.LANCZOS)
    return img.convert('RGB') if rgb else img

# App icon (opaque, iOS-safe), adaptive fg/bg/monochrome, favicon
composed(1024,0.64,bg=LAV,rgb=True).save('assets/icon.png')
composed(1024,0.62).save('assets/android-icon-foreground.png')
Image.new('RGBA',(1024,1024),LAV+(255,)).save('assets/android-icon-background.png')
composed(1024,0.62,mono=True).save('assets/android-icon-monochrome.png')
composed(512,0.74,bg=LAV,rgb=True).save('assets/favicon.png')

# Splash logo: smiley + "Chorely" wordmark, transparent (contain on lavender)
W,H=1600,2000
logo=Image.new('RGBA',(W,H),(0,0,0,0))
m=992
sm=smiley(m*SS).resize((m,m),Image.LANCZOS)
logo.paste(sm,((W-m)//2,200),sm)
font=ImageFont.truetype(FONT,300)
d=ImageDraw.Draw(logo); text="Chorely"
bb=d.textbbox((0,0),text,font=font); tw=bb[2]-bb[0]
d.text(((W-tw)//2-bb[0], 200+m+50-bb[1]), text, font=font, fill=PINK+(255,))
logo=logo.crop(logo.getbbox())
logo.save('assets/chorely-logo.png')
print("OK", logo.size)
