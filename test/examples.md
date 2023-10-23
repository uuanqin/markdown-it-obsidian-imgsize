# TEST CASES
# If you're on Github, it's recommended to view this file in `Code` mode
# -----------------------------------
# A case is like:
# ```
# [Markdown]
# Original Texts.
# [HTML]
# Rendered Texts.
# ```
# -----------------------------------
# 
# Written By wuanqin (wuanqin@mail.ustc.edu.cn), base on k_taka's work.
# 
# Note: test.js recognizes comments in this file by RegExp '/# .*\n/gm', which means that
#       comments should start with '# ' in each line.


# =================== Basic ========================

# CommonMark
[Markdown]
![Figure](k_taka's_cat.jpg)
[HTML]
<p><img src="k_taka's_cat.jpg" alt="Figure"></p>

# Alt with space
[Markdown]
![A cat](k_taka's_cat.jpg)
[HTML]
<p><img src="k_taka's_cat.jpg" alt="A cat"></p>

# Empty Alt
[Markdown]
![](k_taka's_cat.jpg)
[HTML]
<p><img src="k_taka's_cat.jpg" alt=""></p>

# With A Title
[Markdown]
![Figure](k_taka's_cat.jpg "A cat.")
[HTML]
<p><img src="k_taka's_cat.jpg" alt="Figure" title="A cat."></p>

# Online Picture
[Markdown]
![Figure](https://cdn.gallery.uuanqin.top/img/k_taka's_cat.webp)
[HTML]
<p><img src="https://cdn.gallery.uuanqin.top/img/k_taka's_cat.webp" alt="Figure"></p>

# ===================== OFM ===================

# OFM - designate width of a img
[Markdown]
![A cat|100](k_taka's_cat.jpg)
[HTML]
<p><img src="k_taka's_cat.jpg" alt="A cat" width="100px"></p>

# Designate width and height of a img
[Markdown]
![A cat|100x200](k_taka's_cat.jpg)
[HTML]
<p><img src="k_taka's_cat.jpg" alt="A cat" width="100px" height="200px"></p>

# Spaces Are Allowed
[Markdown]
![A cat|  100](k_taka's_cat.jpg)
[HTML]
<p><img src="k_taka's_cat.jpg" alt="A cat" width="100px"></p>

# Spaces Are Allowed
[Markdown]
![A cat| 100 ](k_taka's_cat.jpg)
[HTML]
<p><img src="k_taka's_cat.jpg" alt="A cat" width="100px"></p>

# Spaces Are Allowed
[Markdown]
![A cat|100 x 200](k_taka's_cat.jpg)
[HTML]
<p><img src="k_taka's_cat.jpg" alt="A cat" width="100px" height="200px"></p>

# Spaces Are Allowed
[Markdown]
![A cat| 100x200 ](k_taka's_cat.jpg)
[HTML]
<p><img src="k_taka's_cat.jpg" alt="A cat" width="100px" height="200px"></p>

# Unable to identify
[Markdown]
![A cat|100X200](k_taka's_cat.jpg)
[HTML]
<p><img src="k_taka's_cat.jpg" alt="A cat|100X200"></p>

# Unable to identify
[Markdown]
![A cat|100-x200](k_taka's_cat.jpg)
[HTML]
<p><img src="k_taka's_cat.jpg" alt="A cat|100-x200"></p>

# Unable to identify
[Markdown]
![A cat|100x2n00](k_taka's_cat.jpg)
[HTML]
<p><img src="k_taka's_cat.jpg" alt="A cat|100x2n00"></p>

